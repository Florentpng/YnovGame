import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameState, type PokemonInstance } from '../state/GameState';
import { getSpecies } from '../data/species';
import { getMove } from '../data/moves';
import { calculateDamage } from '../combat/damage';

export interface BattleInitData {
    kind: 'wild' | 'trainer';
    enemyTeamSpeciesIds: string[];
    trainerId?: string;
}

export class Battle extends Scene {
    private initData!: BattleInitData;
    private playerTeam!: PokemonInstance[];
    private enemyTeam!: PokemonInstance[];
    private playerActive = 0;
    private enemyActive = 0;
    private menuGroup!: Phaser.GameObjects.Group;
    private menuMode: 'main' | 'attack' | 'pokemon' | 'locked' = 'locked';
    private navButtons: Array<{
        bg: Phaser.GameObjects.Rectangle;
        txt: Phaser.GameObjects.Text;
        onClick: () => void;
        disabled: boolean;
    }> = [];
    private navIndex = 0;
    private escAction: (() => void) | null = null;

    private playerSprite!: Phaser.GameObjects.Sprite;
    private enemySprite!: Phaser.GameObjects.Sprite;
    
    private playerHpText!: Phaser.GameObjects.Text;
    private enemyHpText!: Phaser.GameObjects.Text;
    private playerHpBar!: Phaser.GameObjects.Rectangle;
    private enemyHpBar!: Phaser.GameObjects.Rectangle;
    private playerNameText!: Phaser.GameObjects.Text;
    private enemyNameText!: Phaser.GameObjects.Text;
    private textBox!: Phaser.GameObjects.Text;

    constructor() { super('Battle'); }

    init(data: any) {
        this.initData = data;
        this.enemyActive = 0;
        this.playerActive = 0;
    
        this.playerTeam = GameState.playerTeam;

        const firstAliveIndex = this.playerTeam.findIndex((pokemon: any) => pokemon.currentHp > 0);

        this.playerActive = firstAliveIndex !== -1 ? firstAliveIndex : 0;
    
        if (data.kind === 'wild') {
            this.enemyTeam = data.enemyTeamSpeciesIds.map((id: string) => ({
                speciesId: id,
                currentHp: 34,
                maxHp: 34,
            }));
        } else {
            this.enemyTeam = data.enemyTeamSpeciesIds.map((id: string) => ({
                speciesId: id,
                currentHp: 34,
                maxHp: 34,
            }));
        }
    }

    create() {
        if (this.initData.kind === 'trainer' && this.initData.trainerId) {
            this.sound.play('trainer_music', { loop: true, volume: 0.5 });
        } else {
            this.sound.play('wild_music', { loop: true, volume: 0.5 });
        }

        const background = this.add.image(512, 315, 'battle_background');
        
        background.setDisplaySize(1004, 605);
    
        this.add.rectangle(512, 384, 1004, 748).setStrokeStyle(2, 0xffffff);
    
        this.makeEnemyArea();
        this.makePlayerArea();
        this.makeTextBox();
    
        const opener = this.initData.kind === 'wild'
            ? `Un ${getSpecies(this.enemyTeam[0].speciesId).name} sauvage apparaît !`
            : `Le dresseur veut combattre !`;
        this.setText(opener);
    
        this.menuGroup = this.add.group();
        this.time.delayedCall(500, () => this.showMainMenu());
    
        const kb = this.input.keyboard!;
        kb.on('keydown-LEFT',  () => this.navMove(-1));
        kb.on('keydown-RIGHT', () => this.navMove(1));
        kb.on('keydown-UP',    () => this.navMove(-1));
        kb.on('keydown-DOWN',  () => this.navMove(1));
        kb.on('keydown-ENTER', () => this.navConfirm());
        kb.on('keydown-SPACE', () => this.navConfirm());
        kb.on('keydown-ESC',   () => { if (this.escAction) this.escAction(); });
    
        EventBus.emit('current-scene-ready', this);
    }

    private makeEnemyArea() {
        const e = this.enemyTeam[this.enemyActive];
        const sp = getSpecies(e.speciesId);
    
        this.enemySprite = this.add.sprite(768, 250, e.speciesId);

        this.enemySprite.setDisplaySize(260, 260);
    
        // MODIFICATION : On décale tout vers la gauche (ex: X = 480)
        const infoX = 220;
        const infoY = 180;
    
        this.enemyNameText = this.add.text(infoX, infoY, sp.name, {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
        });
        
        // Le fond de la jauge
        this.add.rectangle(infoX, infoY + 40, 200, 12, 0x444444).setOrigin(0, 0.5);
        
        // La jauge verte
        this.enemyHpBar = this.add.rectangle(infoX, infoY + 40, 200, 12, 0x44dd44).setOrigin(0, 0.5);
        
        // Le texte des PV
        this.enemyHpText = this.add.text(infoX, infoY + 60, `${e.currentHp} / ${e.maxHp}`, {
            fontFamily: 'Arial', fontSize: 14, color: '#ffffff',
        });
    }

    private makePlayerArea() {
        const p = this.playerTeam[this.playerActive];
        const sp = getSpecies(p.speciesId);
    
        this.playerSprite = this.add.sprite(256, 495, p.speciesId);
        this.playerSprite.setDisplaySize(290, 290);
    
        const infoX = 620;
        const infoY = 470;
    
        this.playerNameText = this.add.text(infoX, infoY, sp.name, {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
        });
    
        this.add.rectangle(infoX, infoY + 40, 200, 12, 0x444444).setOrigin(0, 0.5);
    
        const hpRatio = p.currentHp / p.maxHp;
        
        const currentBarWidth = 200 * hpRatio;
    
        this.playerHpBar = this.add.rectangle(infoX, infoY + 40, currentBarWidth, 12, 0x44dd44).setOrigin(0, 0.5);
    
        this.playerHpText = this.add.text(infoX, infoY + 60, `${p.currentHp} / ${p.maxHp}`, {
            fontFamily: 'Arial', fontSize: 14, color: '#ffffff',
        });
    }

    private makeTextBox() {
        this.add.rectangle(512, 680, 1004, 120, 0x000000, 0.7).setStrokeStyle(2, 0xffffff);
        this.textBox = this.add.text(40, 640, '', {
            fontFamily: 'Arial', fontSize: 22, color: '#ffffff', wordWrap: { width: 950 },
        });
    }

    private setText(s: string) {
        this.textBox.setText(s);
    }

    private clearMenu() {
        this.menuGroup.clear(true, true);
        this.navButtons = [];
        this.navIndex = 0;
        this.escAction = null;
    }

    private showMainMenu() {
        this.clearMenu();
        this.menuMode = 'main';
        const isWild = this.initData.kind === 'wild';
        this.makeMenuButton(280, 660, 'Attaquer', () => this.showAttackMenu());
        this.makeMenuButton(480, 660, 'Pokémon', () => this.showPokemonMenu());
        this.makeMenuButton(880, 660, 'Fuir',     () => this.playerFlee(), !isWild);
        this.setText('Que faire ?');
        this.escAction = null;
    }

    private showAttackMenu() {
        this.clearMenu();
        this.menuMode = 'attack';
        const p = this.playerTeam[this.playerActive];
        const sp = getSpecies(p.speciesId);
        sp.moveIds.forEach((moveId, i) => {
            this.makeMenuButton(280 + i * 200, 660, getMove(moveId).name, () => this.playerAttack(moveId));
        });
        this.makeMenuButton(880, 660, 'Retour', () => this.showMainMenu());
        this.escAction = () => this.showMainMenu();
    }

    private showPokemonMenu() {
        this.clearMenu();
        this.menuMode = 'pokemon';
        this.playerTeam.forEach((mon, i) => {
            const sp = getSpecies(mon.speciesId);
            const dead = mon.currentHp <= 0;
            const active = i === this.playerActive;
            const label = `${sp.name} ${mon.currentHp}/${mon.maxHp}${active ? ' *' : ''}`;
            this.makeMenuButton(280 + i * 200, 660, label, () => this.playerSwitch(i), dead || active);
        });
        this.makeMenuButton(880, 660, 'Retour', () => this.showMainMenu());
        this.escAction = () => this.showMainMenu();
    }

    private playerAttack(moveId: string) {
        this.menuMode = 'locked';
        this.clearMenu();
        const move = getMove(moveId);
        const attacker = this.playerTeam[this.playerActive];
        const defender = this.enemyTeam[this.enemyActive];
        const attackerSp = getSpecies(attacker.speciesId);
        const defenderSp = getSpecies(defender.speciesId);

        const dmg = calculateDamage({
            power: move.power,
            attackType: move.type,
            attackerAtk: attackerSp.baseAtk,
            defenderType: defenderSp.type,
        });

        this.setText(`${attackerSp.name} utilise ${move.name} !`);
        this.flashAndDamage(this.enemySprite, () => {
            defender.currentHp = Math.max(0, defender.currentHp - dmg);
            this.refreshEnemyHp();
            this.time.delayedCall(600, () => this.afterPlayerAction());
        });
    }

    private afterPlayerAction() {
        const defender = this.enemyTeam[this.enemyActive];
        if (defender.currentHp <= 0) {
            this.setText(`${getSpecies(defender.speciesId).name} est K.O. !`);
            this.time.delayedCall(900, () => this.onEnemyFainted());
            return;
        }
        this.enemyAttack();
    }

    private enemyAttack() {
        const attacker = this.enemyTeam[this.enemyActive];
        const defender = this.playerTeam[this.playerActive];
        const sp = getSpecies(attacker.speciesId);
        const defenderSp = getSpecies(defender.speciesId);

        const move = getMove(sp.moveIds[0]);
        const dmg = calculateDamage({
            power: move.power,
            attackType: move.type,
            attackerAtk: sp.baseAtk,
            defenderType: defenderSp.type,
        });

        this.setText(`${sp.name} utilise ${move.name} !`);
        this.flashAndDamage(this.playerSprite, () => {
            const idx = this.playerActive;
            GameState.damagePokemon(idx, dmg);
            this.refreshPlayerHp();
            this.time.delayedCall(600, () => this.afterEnemyAction());
        });
    }

    private afterEnemyAction() {
        const def = this.playerTeam[this.playerActive];
        if (def.currentHp <= 0) {
            this.setText(`${getSpecies(def.speciesId).name} est K.O. !`);
            this.time.delayedCall(900, () => this.onPlayerFainted());
            return;
        }
        this.showMainMenu();
    }

    private onEnemyFainted() {
        const next = this.enemyTeam.findIndex((p, i) => i > this.enemyActive && p.currentHp > 0);
        if (next !== -1) {
            this.enemyActive = next;
            this.rebuildEnemyArea();
            const sp = getSpecies(this.enemyTeam[next].speciesId);
            this.setText(`L'adversaire envoie ${sp.name} !`);
            this.time.delayedCall(900, () => this.showMainMenu());
            return;
        }
        if (this.initData.kind === 'trainer' && this.initData.trainerId) {
            GameState.markTrainerDefeated(this.initData.trainerId);
        }
        this.setText('Victoire !');
        this.time.delayedCall(1200, () => this.returnToOverworld());
    }

    private onPlayerFainted() {
        const aliveIndices = this.playerTeam
            .map((p, i) => (p.currentHp > 0 ? i : -1))
            .filter((i) => i !== -1);
        if (aliveIndices.length === 0) {
            this.setText('Toute ton équipe est K.O...');
            this.sound.stopAll();
            this.time.delayedCall(1500, () => this.scene.start('GameOver'));
            return;
        }
        this.setText('Choisis ton prochain Pokémon !');
        this.time.delayedCall(700, () => this.showForcedSwitchMenu(aliveIndices));
    }

    private showForcedSwitchMenu(aliveIndices: number[]) {
        this.clearMenu();
        this.menuMode = 'pokemon';
        aliveIndices.forEach((idx, i) => {
            const mon = this.playerTeam[idx];
            const sp = getSpecies(mon.speciesId);
            const label = `${sp.name} ${mon.currentHp}/${mon.maxHp}`;

            this.makeMenuButton(520 + i * 220, 660, label, () => this.forcedSwitch(idx));
        });
        this.escAction = null;
    }

    private forcedSwitch(index: number) {
        this.menuMode = 'locked';
        this.clearMenu();
        this.playerActive = index;
        this.rebuildPlayerArea();
        const sp = getSpecies(this.playerTeam[index].speciesId);
        this.setText(`En avant, ${sp.name} !`);
        this.time.delayedCall(700, () => this.showMainMenu());
    }

    private rebuildEnemyArea() {
        const e = this.enemyTeam[this.enemyActive];
        const sp = getSpecies(e.speciesId);
        
        this.enemySprite.setTexture(e.speciesId);
        this.enemyHpBar.setScale(1, 1);
        this.refreshEnemyHp();
        
        // On supprime les vieux rectangles et on met juste à jour le nom !
        this.enemyNameText.setText(sp.name);
    }

    private playerSwitch(index: number) {
        this.menuMode = 'locked';
        this.clearMenu();
        this.playerActive = index;
        this.rebuildPlayerArea();
        const sp = getSpecies(this.playerTeam[index].speciesId);
        this.setText(`En avant, ${sp.name} !`);
        this.time.delayedCall(700, () => this.enemyAttack());
    }

    private rebuildPlayerArea() {
        const p = this.playerTeam[this.playerActive];
        const sp = getSpecies(p.speciesId);
        
        this.playerSprite.setTexture(p.speciesId);
        this.refreshPlayerHp();

        // On supprime les vieux rectangles et on met juste à jour le nom !
        this.playerNameText.setText(sp.name);
    }

    private flashAndDamage(sprite: Phaser.GameObjects.Sprite, after: () => void) {
        sprite.setTint(0xff4040); // Teinte rouge de dégâts
        this.time.delayedCall(180, () => {
            sprite.clearTint(); // Restaure l'image originale
            after();
        });
    }

    private refreshEnemyHp() {
        const e = this.enemyTeam[this.enemyActive];
        const ratio = Math.max(0, e.currentHp / e.maxHp);
        this.tweens.add({ targets: this.enemyHpBar, scaleX: ratio, duration: 300 });
        this.enemyHpBar.setOrigin(0, 0.5);
        this.enemyHpText.setText(`${e.currentHp} / ${e.maxHp}`);
    }

    private refreshPlayerHp() {
        const p = this.playerTeam[this.playerActive];
        const ratio = Math.max(0, p.currentHp / p.maxHp);
        this.tweens.add({ targets: this.playerHpBar, scaleX: ratio, duration: 300 });
        this.playerHpBar.setOrigin(0, 0.5);
        this.playerHpText.setText(`${p.currentHp} / ${p.maxHp}`);
    }

    private playerFlee() {
        this.menuMode = 'locked';
        this.clearMenu();
        this.setText('Tu prends la fuite !');
        this.time.delayedCall(800, () => this.returnToOverworld());
    }

    private returnToOverworld() {
        this.sound.stopAll();
        this.scene.start('Overworld');
    }

    private refreshHighlight() {
        this.navButtons.forEach((n, i) => {
            if (n.disabled) return;
            const highlighted = i === this.navIndex;
            n.bg.setStrokeStyle(highlighted ? 4 : 2, highlighted ? 0xffff00 : 0xffffff);
            n.bg.setFillStyle(highlighted ? 0x0088ff : 0x0066cc);
        });
    }

    private navMove(delta: number) {
        if (this.navButtons.length === 0) return;
        let i = this.navIndex;
        for (let step = 0; step < this.navButtons.length; step++) {
            i = (i + delta + this.navButtons.length) % this.navButtons.length;
            if (!this.navButtons[i].disabled) { this.navIndex = i; this.refreshHighlight(); return; }
        }
    }

    private navConfirm() {
        const b = this.navButtons[this.navIndex];
        if (b && !b.disabled) b.onClick();
    }

    private makeMenuButton(x: number, y: number, label: string, onClick: () => void, disabled = false) {
        const bg = this.add.rectangle(x, y, 180, 40, disabled ? 0x555555 : 0x0066cc)
            .setStrokeStyle(2, 0xffffff);
        const txt = this.add.text(x, y, label, {
            fontFamily: 'Arial Black', fontSize: 18,
            color: disabled ? '#999999' : '#ffffff',
        }).setOrigin(0.5);

        if (!disabled) {
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerover', () => { this.navIndex = this.navButtons.findIndex((n) => n.bg === bg); this.refreshHighlight(); });
            bg.on('pointerdown', onClick);
        }

        this.menuGroup.add(bg);
        this.menuGroup.add(txt);
        this.navButtons.push({ bg, txt, onClick, disabled });

        if (!disabled && this.navButtons.filter((n) => !n.disabled).length === 1) {
            this.navIndex = this.navButtons.length - 1;
        }
        this.refreshHighlight();
    }
}