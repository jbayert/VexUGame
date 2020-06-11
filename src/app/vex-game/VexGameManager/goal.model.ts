import { SimpleGoal } from "./field.model";
import { Alliance } from "./game-constants.model";

export class Goal {
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
        for (var i = 0; i <= 2; i+=1) {
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

    getSimpleGoal(): SimpleGoal{
        let _position = this.position;
        let allianceList:Alliance[] = [];//this is guarantted to have 3 elements
        for(let i =0; i<3;i++){
            if (this._ballOrder[i]){
                allianceList.push(this._ballOrder[i])
            }else{
                allianceList.push("none")
            }
        }

        return {
            position: _position,
            ownedBy: this.ownedBy,
            ballsScored:allianceList
        }
    }

    clone(): Goal {
        return new Goal(this._ballOrder, this.position);
    }

    constructor(ballOrder: Alliance[], position: PositionVex) {
        this._ballOrder = ballOrder;
        this.position = position;
    }
}
