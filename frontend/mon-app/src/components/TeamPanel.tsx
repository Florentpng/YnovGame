import { useEffect, useState } from 'react';
import { EventBus } from '../game/EventBus';
import type { PokemonInstance } from '../game/state/GameState';
import { SPECIES } from '../game/data/species';
 
const TYPE_COLOR: Record<string, string> = {
    fire: '#d35400', water: '#2980b9', grass: '#27ae60',
};
 
export function TeamPanel() {
    const [team, setTeam] = useState<PokemonInstance[]>([]);
 
    useEffect(() => {
        const handler = (next: PokemonInstance[]) => setTeam(next);
        EventBus.on('team-updated', handler);
        return () => { EventBus.off('team-updated', handler); };
    }, []);
 
    const slots = [0, 1, 2];
 
    return (
        <div style={{ padding: 16, color: '#fff', fontFamily: 'Arial' }}>
            <h3 style={{ margin: '0 0 12px' }}>Équipe</h3>
            {slots.map((i) => {
                const mon = team[i];
                if (!mon) {
                    return (
                        <div key={i} style={{ marginBottom: 8, opacity: 0.4 }}>
                            — vide —
                        </div>
                    );
                }
                const sp = SPECIES[mon.speciesId as keyof typeof SPECIES];
                const ratio = Math.max(0, mon.currentHp / mon.maxHp);
                return (
                    <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ fontWeight: 'bold', color: TYPE_COLOR[sp.type] }}>{sp.name}</span>
                            <span>{mon.currentHp} / {mon.maxHp}</span>
                        </div>
                        <div style={{ background: '#333', height: 8, borderRadius: 4, marginTop: 4 }}>
                            <div style={{
                                width: `${ratio * 100}%`,
                                height: '100%',
                                background: ratio > 0.3 ? '#44dd44' : '#dd4444',
                                borderRadius: 4,
                                transition: 'width 0.3s',
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}