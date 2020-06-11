/**
 *     The initial setup for the game
 *  
 *            (row, column) 
 * 
 *          0,0  | 0,1  | 0,2
 *               |      |
 *               | red  | 
 *          blue | blue | red
 *          red  | red  | blue
 *          _____|______|_____
 *               |      |
 *   Red    1,0  | 1,1  | 1,2    Blue
 *   Side        |      |        Side
 *          blue |      | red
 *          red  |      | blue
 *          _____|______|_____
 *               |      |     
 *          2,0  | 2,1  | 2,2
 *               |      |
 *               | blue | 
 *          blue | red  | red
 *          red  | blue | blue
 *               |      |
 *     
 *      The naming convention is as follows
 *      
 *      ------- R0
 *      ------- R1
 *      ------- R2
 * 
 *       Column
 *      C0  C1  C2
 *      |   |   |
 *      |   |   |
 *      |   |   |
 *      
 *      D0        D1
 *      \          /
 *       \        /
 *        \      /
 * 
 */

import { ConnectedRows, Alliance} from './game-constants.model'

export interface Stats {
    red: {
        score: number;
        ballsScored: number;
        winPoint: number;
        connectedRowsScore: any;
        connectedRows: ConnectedRows[];
        autonomousBonus: number;
    };
    autonomousWinner: Alliance;

    blue: {
        score: number;
        ballsScored: number;
        winPoint: number;
        connectedRowsScore: any;
        connectedRows: ConnectedRows[];
        autonomousBonus: number;
    }
}