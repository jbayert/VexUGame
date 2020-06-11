import { Alliance } from './game-constants.model';
import { Stats } from './stats.model';

export interface SimpleGoal {
    position: PositionVex;
    ownedBy: Alliance;
    ballsScored: Alliance[];//this is guaranteed to include atleast 3 balls
}

export interface Field {
    goals:SimpleGoal[][];
    stats:Stats;
    lastChange: string;
}
