import { BehaviorSubject } from 'rxjs'

type Alliance = "red" | "blue" | "none";
type ConnectedRows = "R0" | "R1" | "R2" | "C0" | "C1" | "C2" | "D0" | "D1";

const AUTONOMOUS_BONUS = 6;
const WIN_POINT = 1;
const CONNECTED_ROW_SCORE = 6;

interface PositionVex {
    row: number;
    column: number;
}

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

interface Stats {
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

class Goal {
    //the first term is the lowest ball.
    private _ballOrder: Alliance[];
    position: PositionVex;

    set ballOrder(newOrder: Alliance[]) {
        this._ballOrder = newOrder;
    }
    get ballOrder(): Alliance[] {
        return this._ballOrder;
    }

    addBall(team: "red" | "blue") {
        if (this._ballOrder.length<=2){
            this._ballOrder.push(team);
        }
    }
    removeBall(): Alliance | undefined {
        return this._ballOrder.shift();
    }

    //the 0 position is the ball on the floor
    peek(position: number): Alliance | undefined {
        return this._ballOrder[position];
    }

    get ownedBy(): Alliance {
        if (this._ballOrder.length === 0) {
            return "none";
        } else if (this._ballOrder.length <= 2) {
            return this._ballOrder[this._ballOrder.length - 1]
        } else {
            return this._ballOrder[2];
        }
    }

    get name(): string {
        return `row ${this.position.row} column ${this.position.column}`;
    }

    getScore(): {
        red: number,
        blue: number
    } {
        var redCount = 0;
        var blueCount = 0;
        for (var i = 0; i <= 2; i++) {
            if (this._ballOrder[i] === "red") {
                redCount++;
            }
            if (this._ballOrder[i] === "blue") {
                blueCount++;
            }
        }
        return {
            red: redCount,
            blue: blueCount,
        };
    }

    clone(): Goal {
        return new Goal(this._ballOrder, this.position);
    }

    constructor(ballOrder: Alliance[], position: PositionVex) {
        this._ballOrder = ballOrder;
        this.position = position;
    }
}

class VexGameManager {
    private _goals: Goal[][];

    private autonomousWinner: Alliance;
    private redWinPoint: boolean;
    private blueWinPoint: boolean;

    //private _score: Field;

    //private _scoreSubject:BehaviorSubject<Score>;

    constructor() {
        this._goals = [];
        for (var i = 0; i < 3; i++) {
            this._goals[i] = [];
        }

        this._goals[0][0] = new Goal(["red", "blue"], { row: 0, column: 0 });
        this._goals[0][1] = new Goal(["red", "blue", "red"], { row: 0, column: 1 });
        this._goals[0][2] = new Goal(["blue", "red"], { row: 0, column: 2 });

        this._goals[1][0] = new Goal(["red", "blue"], { row: 1, column: 0 });
        this._goals[1][1] = new Goal([], { row: 1, column: 1 });
        this._goals[1][2] = new Goal(["blue", "red"], { row: 1, column: 2 });

        this._goals[2][0] = new Goal(["red", "blue"], { row: 2, column: 0 });
        this._goals[2][1] = new Goal(["blue", "red", "blue"], { row: 2, column: 1 });
        this._goals[2][2] = new Goal(["blue", "red"], { row: 2, column: 2 });

        this.autonomousWinner = "none";
        this.redWinPoint = false;
        this.blueWinPoint = false;
    }

    private getGoal(position: PositionVex): Goal {
        return this._goals[position.row][position.column];
    }

    private getBallsScored(): {
        red: number,
        blue: number
    } {
        let red = 0;
        let blue = 0;

        for (let row = 0; row <= 2; row++) {
            for (let column = 0; column <= 2; column++) {
                let score = this.getGoal({ row: row, column: column }).getScore();
                blue += score.blue
                red += score.red
            }
        }
        return {
            red: red,
            blue: blue,
        };
    }

    private getConnectedRows(): {
        redScore: number,
        redCount: number,
        redRows: ConnectedRows[],
        blueScore: number,
        blueCount: number,
        blueRows: ConnectedRows[],
    } {
        var redRow: Array<ConnectedRows> = []
        var blueRow: Array<ConnectedRows> = []


        //rows
        //R0
        if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 0, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 0, column: 2 }).ownedBy === "red")) {
            redRow.push("R0")
        } else {
            if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 0, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 0, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R0")
            }
        }

        //R1
        if ((this.getGoal({ row: 1, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 2 }).ownedBy === "red")) {
            redRow.push("R1")
        } else {
            if ((this.getGoal({ row: 1, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R1")
            }
        }

        //R2
        if ((this.getGoal({ row: 2, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("R2")
        } else {
            if ((this.getGoal({ row: 2, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R2")
            }
        }

        //C0
        if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 0 }).ownedBy === "red")) {
            redRow.push("C0")
        } else {
            if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 0 }).ownedBy === "blue")) {
                blueRow.push("C0")
            }
        }

        //C1
        if ((this.getGoal({ row: 0, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 1 }).ownedBy === "red")) {
            redRow.push("C1")
        } else {
            if ((this.getGoal({ row: 0, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 1 }).ownedBy === "blue")) {
                blueRow.push("C1")
            }
        }

        //C2
        if ((this.getGoal({ row: 0, column: 2 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 2 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("C2")
        } else {
            if ((this.getGoal({ row: 0, column: 2 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 2 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("C2")
            }
        }

        //D0
        if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("D0")
        } else {
            if ((this.getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("D0")
            }
        }

        //D1
        if ((this.getGoal({ row: 0, column: 2 }).ownedBy === "red") &&
            (this.getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this.getGoal({ row: 2, column: 0 }).ownedBy === "red")) {
            redRow.push("D1")
        } else {
            if ((this.getGoal({ row: 0, column: 2 }).ownedBy === "blue") &&
                (this.getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this.getGoal({ row: 2, column: 0 }).ownedBy === "blue")) {
                blueRow.push("D1")
            }
        }

        return {
            redScore: redRow.length * CONNECTED_ROW_SCORE,
            redCount: redRow.length,
            redRows: redRow,
            blueScore: blueRow.length * CONNECTED_ROW_SCORE,
            blueCount: blueRow.length,
            blueRows: blueRow,
        };
    }

    private getFullStats(): Stats {
        let tempConnectedRows = this.getConnectedRows();
        let ballsScored = this.getBallsScored();

        //Calculate Red Score
        let redScore = ballsScored.red + tempConnectedRows.redScore;

        let redAutoBonus = (this.autonomousWinner === "red") ? AUTONOMOUS_BONUS : 0
        redScore += redAutoBonus;

        let redWinPoint = (this.redWinPoint) ? WIN_POINT : 0;
        redScore += redWinPoint;

        //Calculate blue Score
        let blueScore = ballsScored.blue + tempConnectedRows.blueScore;

        let blueAutoBonus = (this.autonomousWinner === "red") ? AUTONOMOUS_BONUS : 0
        blueScore += blueAutoBonus;

        let blueWinPoint = (this.blueWinPoint) ? WIN_POINT : 0;
        blueScore += blueWinPoint;

        return {
            red: {
                score: redScore,
                ballsScored: ballsScored.red,
                winPoint: redWinPoint,
                connectedRowsScore: tempConnectedRows.redScore,
                connectedRows: tempConnectedRows.redRows,
                autonomousBonus: redAutoBonus,
            },
            blue: {
                score: blueScore,
                ballsScored: ballsScored.blue,
                winPoint: blueWinPoint,
                connectedRowsScore: tempConnectedRows.blueScore,
                connectedRows: tempConnectedRows.blueRows,
                autonomousBonus: blueAutoBonus,
            },
            autonomousWinner: this.autonomousWinner,
        }

    }

    addBall(position: PositionVex, alliance: "blue" | "red") {
        this.getGoal(position).addBall(alliance)
    }

    removeBall(position: PositionVex) {
        this.getGoal(position).removeBall();
    }

    setAutonomousWinner(alliance: Alliance) {
        this.autonomousWinner = alliance;
    }

    setWinPoint(alliance: Alliance, addWinPoint: boolean = true) {
        if (alliance === "red") {
            this.redWinPoint = addWinPoint;
        } else if (alliance === "blue") {
            this.blueWinPoint = addWinPoint;
        }
    }

    getStats(): Stats {
        return this.getFullStats();
    }

    getChangeSubscriber() {

    }

    getGoalCopy(position: PositionVex) {
        return this.getGoal(position).clone();
    }
}

/*
var vexGame = new VexGameManager();
vexGame.setAutonomousWinner("red");

vexGame.addBall({row:0,column:0},"red");
vexGame.addBall({row:1,column:0},"red");

vexGame.addBall({row:2,column:0},"red");
vexGame.removeBall({row:2,column:1});
vexGame.addBall({row:2,column:1},"red");
vexGame.addBall({row:2,column:2},"red");

vexGame.setWinPoint("blue");

vexGame.addBall({row:1,column:1},"red");

console.log(vexGame.getGoalCopy({row:2,column:1}))
console.log(vexGame.getStats());
 */