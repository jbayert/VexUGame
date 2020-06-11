import { Subject, Observable, BehaviorSubject } from 'rxjs'
import { Field, SimpleGoal } from './field.model';
import { Goal } from './goal.model'
import { AUTONOMOUS_BONUS,Alliance,CONNECTED_ROW_SCORE,ConnectedRows,WIN_POINT } from './game-constants.model';
import { Stats } from './stats.model';
export class VexGameManager {
    private _goals: Goal[][];

    private _autonomousWinner: Alliance;
    private _redWinPoint: boolean;
    private _blueWinPoint: boolean;

    private _changeSubject: BehaviorSubject<Field>;

    private _curField:Field;

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

        this._autonomousWinner = "none";
        this._redWinPoint = false;
        this._blueWinPoint = false;

        this._changeSubject = new BehaviorSubject<Field|null>(null);
        this._updateField("Field Created");
    }

    private _getGoal(position: PositionVex): Goal {
        return this._goals[position.row][position.column];
    }

    private _getBallsScored(): {
        red: number,
        blue: number
    } {
        let red = 0;
        let blue = 0;

        for (let row = 0; row <= 2; row++) {
            for (let column = 0; column <= 2; column++) {
                let score = this._getGoal({ row: row, column: column }).getScore();
                blue += score.blue
                red += score.red
            }
        }
        return {
            red: red,
            blue: blue,
        };
    }

    private _getConnectedRows(): {
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
        if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 0, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 0, column: 2 }).ownedBy === "red")) {
            redRow.push("R0")
        } else {
            if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 0, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 0, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R0")
            }
        }

        //R1
        if ((this._getGoal({ row: 1, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 2 }).ownedBy === "red")) {
            redRow.push("R1")
        } else {
            if ((this._getGoal({ row: 1, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R1")
            }
        }

        //R2
        if ((this._getGoal({ row: 2, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("R2")
        } else {
            if ((this._getGoal({ row: 2, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("R2")
            }
        }

        //C0
        if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 0 }).ownedBy === "red")) {
            redRow.push("C0")
        } else {
            if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 0 }).ownedBy === "blue")) {
                blueRow.push("C0")
            }
        }

        //C1
        if ((this._getGoal({ row: 0, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 1 }).ownedBy === "red")) {
            redRow.push("C1")
        } else {
            if ((this._getGoal({ row: 0, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 1 }).ownedBy === "blue")) {
                blueRow.push("C1")
            }
        }

        //C2
        if ((this._getGoal({ row: 0, column: 2 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 2 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("C2")
        } else {
            if ((this._getGoal({ row: 0, column: 2 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 2 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("C2")
            }
        }

        //D0
        if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 2 }).ownedBy === "red")) {
            redRow.push("D0")
        } else {
            if ((this._getGoal({ row: 0, column: 0 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 2 }).ownedBy === "blue")) {
                blueRow.push("D0")
            }
        }

        //D1
        if ((this._getGoal({ row: 0, column: 2 }).ownedBy === "red") &&
            (this._getGoal({ row: 1, column: 1 }).ownedBy === "red") &&
            (this._getGoal({ row: 2, column: 0 }).ownedBy === "red")) {
            redRow.push("D1")
        } else {
            if ((this._getGoal({ row: 0, column: 2 }).ownedBy === "blue") &&
                (this._getGoal({ row: 1, column: 1 }).ownedBy === "blue") &&
                (this._getGoal({ row: 2, column: 0 }).ownedBy === "blue")) {
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

    private _getFullStats(): Stats {
        let tempConnectedRows = this._getConnectedRows();
        let ballsScored = this._getBallsScored();

        //Calculate Red Score
        let redScore = ballsScored.red + tempConnectedRows.redScore;

        let redAutoBonus = (this._autonomousWinner === "red") ? AUTONOMOUS_BONUS : 0
        redScore += redAutoBonus;

        let redWinPoint = (this._redWinPoint) ? WIN_POINT : 0;
        redScore += redWinPoint;

        //Calculate blue Score
        let blueScore = ballsScored.blue + tempConnectedRows.blueScore;

        let blueAutoBonus = (this._autonomousWinner === "red") ? AUTONOMOUS_BONUS : 0
        blueScore += blueAutoBonus;

        let blueWinPoint = (this._blueWinPoint) ? WIN_POINT : 0;
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
            autonomousWinner: this._autonomousWinner,
        }

    }

    private _updateField(change:string){
        let _goals: SimpleGoal[][] = [];
        for(let row= 0; row<3;row+=1){
            let rowList:SimpleGoal[] = []
            for (let column = 0; column<3;column+=1){
                rowList.push(this._getGoal({row:row,column:column}).getSimpleGoal())
            }
            _goals.push(rowList);
        }
        let _stats:Stats = this._getFullStats();
        this._curField = {
            goals:_goals,
            stats: _stats,
            lastChange: change,
        }
        this._changeSubject.next(this._curField);

    }

    addBall(position: PositionVex, alliance: "blue" | "red") {
        this._getGoal(position).addBall(alliance);
        this._updateField("Ball added");
    }

    removeBall(position: PositionVex) {
        this._getGoal(position).removeBall();
        this._updateField("Ball removed");
    }

    setAutonomousWinner(alliance: Alliance) {
        this._autonomousWinner = alliance;
        this._updateField("Autonomous Winner updated");
    }

    setWinPoint(alliance: Alliance, addWinPoint: boolean = true) {
        if (alliance === "red") {
            this._redWinPoint = addWinPoint;
            this._updateField("Red Win Point Updatd");
        } else if (alliance === "blue") {
            this._blueWinPoint = addWinPoint;
            this._updateField("Blue Win Point Updatd");
        }

    }

    getStats(): Stats {
        return this._getFullStats();
    }

    getChangeSubscriber():Observable<any> {
        return this._changeSubject.asObservable();
    }

    getGoalCopy(position: PositionVex) {
        return this._getGoal(position).clone();
    }

    handleEvent( event:any ){
        switch(event.change){
            case ("add"):{
                this.addBall(event.position,event.alliance);
                break;
            }
            case ("remove"):{
                this.removeBall(event.position);
                break;
            }
            default:{
                break;
            }
        }
    }
}

/*
Test run

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