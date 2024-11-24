import {param,getPosition,page,color,matrix} from  "./dict";

// square in field
class Square {
dom:HTMLDivElement
color:string
    constructor (id:string, color:string, fatherDom:Element, length:number, top:number, left:number) {
    this.color = color;
    this.dom = document.createElement('div');
    this.dom.id = id;
    this.dom.className = color;
    this.dom.style.width = length * 0.9 + 'px';
    this.dom.style.height = length * 0.9 + 'px';
    this.dom.style.top = top + 'px';
    this.dom.style.left = left + 'px';
    this.dom.style.position = 'absolute';
    this.dom.style.borderRadius = '5px';
    fatherDom.appendChild(this.dom);
}


public changeColor(color:string) {
    this.color = color;
    this.dom.className = color;
}
}
const tableCol = 8;
const  gameWidth = document.body.clientWidth < 520 ? (document.body.clientWidth - 50) : 500; 
console.log(gameWidth)
let  squareWidth = gameWidth / tableCol;

//  figure
class Brick {
    dom: HTMLDivElement;
    color: string;
    state: number;
    matrix: number[][];
    squares: Square[];
 
  
    constructor(
      id: string,
      color: string,
      matrix: number[][],
      fatherDom: HTMLElement,
      length: number,
      left: number,
      top: number,
      canDrag: boolean
    ) {
      this.state = 1;
      this.matrix = matrix;
      this.squares = [];
      this.color = color;
  
      // Create DOM element for the brick
      this.dom = document.createElement("div");
      this.dom.id = id;
      this.dom.style.width = `${length}px`;
      this.dom.style.height = `${length}px`;
      this.dom.style.position = "absolute";
      this.dom.style.left = `${left}px`;
      this.dom.style.top = `${top}px`;
  
      // Create Squares inside the brick
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
          if (matrix[i][j]) {
            this.squares.push(
              new Square(
                `bs-${i}-${j}`,
                this.color,
                this.dom,
                length / 5,
                (length / 5) * i,
                (length / 5) * j
              )
            );
          }
        }
      }
  
      // Append brick to parent element
      fatherDom.appendChild(this.dom);
  
      // Add drag functionality if canDrag is true
      if (canDrag) {
        this.addDragHandlers();
      }
    }
  
    private addDragHandlers(): void {
      const that = this;
        
      if ("ontouchend" in document) {
        this.dom.addEventListener(
          "touchstart",
          function (e: TouchEvent) {
            const touch = e.touches[0];
            param.currentBrick = that;
            that.hide();
            console.log( gameWidth,tableCol)
  
            param.dragBrick = new Brick(
              "drag",
              that.color,
              that.matrix,
              document.body,
              gameWidth / tableCol * 5,
              getPosition(that.dom).x,
              getPosition(that.dom).y,
              false
            );
  
            param.x = page.pageX(e) - getPosition(that.dom).x;
            param.y = page.pageY(e) - getPosition(that.dom).y;
  
            document.addEventListener("touchmove", move, false);
            document.addEventListener("touchend", up, false);
          },
          false
        );
      } else {
        this.dom.onmousedown = function (e: MouseEvent) {
          param.currentBrick = that;
          that.hide();
          console.log(gameWidth,tableCol)
  
          param.dragBrick = new Brick(
            "drag",
            that.color,
            that.matrix,
            document.body,
            gameWidth / tableCol *  5,
            getPosition(that.dom).x,
            getPosition(that.dom).y,
            false
          );
  
          param.x = page.layerX(e);
          param.y = page.layerY(e);
  
          document.onmouseup = up;
          document.onmousemove = move;
        };
      }
    }
  
    // Remove brick from DOM
    remove(): void {
      this.state = 0;
      this.dom.parentNode?.removeChild(this.dom);
    }
  
    // Hide brick
    hide(): void {
      this.dom.style.visibility = "hidden";
    }
  
    // Show brick
    show(): void {
      this.dom.style.visibility = "";
    }
    
  }

  
// generate figure
class BrickList {
    dom: HTMLElement;
    list: Brick[];
    amount: number;
    
  
    constructor(gameWidth: number, brickAmount: number) {
      this.list = [];
      this.amount = brickAmount;
      const bricksContainer = document.getElementById("bricks");
  
      if (!bricksContainer) {
        throw new Error("Bricks container not found");
      }
  
      this.dom = bricksContainer;
      this.dom.style.width = `${gameWidth}px`;
      this.dom.style.height = `${gameWidth / brickAmount}px`;
  
      for (let i = 0; i < brickAmount; i++) {
        this.list[i] = new Brick(
          `b-${i}`, 
          color.random(), 
          matrix.random(), 
          this.dom, 
          (gameWidth / brickAmount) * 0.9, 
          (gameWidth / brickAmount) * i, 
          0, 
          true
        );
      }
    }
  
    // Check if all bricks are removed
    isEmpty(): boolean {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].state == 1) return false;
        }
        return true;
    }
  
    // Re-create bricks when needed
    reCreate(): void {
        for (var i = 0; i < this.amount; i++) {
            if (!this.list[i] || this.list[i].state === 0) {
                this.list[i] = new Brick('b' + '-' + i, color.random(), matrix.random(), this.dom, gameWidth / this.amount * 0.9, gameWidth / this.amount * i, 0, true); //0.9防止相邻两个brick相连
            }
        }
    }
    
  }
  

// main table
class Table {
    dom: HTMLElement;
    matrix: number[][];
    squares: Square[];
  
    constructor(gameWidth: number, row: number, col: number) {
      const tableElement = document.getElementById("table");
  
      if (!tableElement) {
        throw new Error("Table container not found");
      }
  
      this.dom = tableElement;
      this.matrix = [];
      this.squares = [];
  
      this.dom.style.width = `${gameWidth}px`;
      this.dom.style.height = `${(gameWidth / col) * row}px`;
  
      // Create the grid matrix and initialize squares
      for (let i = 0; i < row; i++) {
        this.matrix[i] = []; // Initialize row in the matrix
        for (let j = 0; j < col; j++) {
          this.matrix[i][j] = 0; // Initialize cell as empty
          this.squares.push(
            new Square(
              `t-${i}-${j}`, // Unique ID for the square
              color.default, // Default color
              this.dom, // Parent DOM container
              gameWidth / col, // Width and height of each square
              (gameWidth / col) * i, // Top position
              (gameWidth / col) * j // Left position
            )
          );
        }
      }
    }
    public update (positionList:number[][], color:string) {
        for (var i = 0; i < positionList.length; i++) {
            this.matrix[positionList[i][0]][positionList[i][1]] = 1;
            this.squares[positionList[i][0] * this.matrix[0].length + positionList[i][1]].changeColor(color); 
        }

    }
    public clear (rows:number[], cols:number[]) {
        for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < this.matrix[0].length; j++) {
                this.matrix[rows[i]][j] = 0;
                this.squares[rows[i] * this.matrix[0].length + j].changeColor(color.default); //Square.changeColor
            }
        }
        for (var i = 0; i < cols.length; i++) {
            for (var j = 0; j < this.matrix.length; j++) {
                this.matrix[j][cols[i]] = 0;
                this.squares[j * this.matrix[0].length + cols[i]].changeColor(color.default); //Square.changeColor
            }
        }
    }
    
public checkNoCover (brick:Brick, i:number, j:number) {
    var result = [];
    if (i + brick.matrix.length > this.matrix.length || j + brick.matrix[0].length > this.matrix[0].length) return false;
    for (var n = 0; n < brick.matrix.length; n++) {
        for (var m = 0; m < brick.matrix[0].length; m++) {
            if (this.matrix[i + n][j + m] && brick.matrix[n][m]) {
                return false;
            }
            if (brick.matrix[n][m]) {
                result.push([i + n, j + m]);
            }
        }
    }
    return result;
}
public checkPossible (brickList:BrickList) {
    for (var n = 0; n < brickList.list.length; n++) {
        if (brickList.list[n].state == 1) {
            for (var i = 0; i <= this.matrix.length - brickList.list[n].matrix.length; i++) {
                for (var j = 0; j <= this.matrix[0].length - brickList.list[n].matrix[0].length; j++) {
                    //定点i,j
                    var result = this.checkNoCover(brickList.list[n], i, j);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }
    return false;
}
// clear win cell
public needClear () {
    var rows = [];
    var cols = [];
    for (var i = this.matrix.length - 1; i >= 0; i--) {
        var sum = 0;
        for (var j = this.matrix[0].length - 1; j >= 0; j--) {
            sum += this.matrix[i][j];
        }
        if (sum == this.matrix[0].length) { rows.push(i); }
    }
    for (var i = this.matrix[0].length - 1; i >= 0; i--) {
        var sum = 0;
        for (var j = this.matrix.length - 1; j >= 0; j--) {
            sum += this.matrix[j][i];
        }
        if (sum == this.matrix.length) { cols.push(i); }
    }
    return [rows, cols];
}
// clear table
public clearAll() {
  this.matrix = this.matrix.map(row => row.map(() => 0));
  this.squares.forEach(square => {
    square.changeColor(color.default); // Возвращаем клетки в дефолтный цвет
  });
  }

}





// перетаскивание 
function up(e:any) {
    e.preventDefault();
   if ('ontouchend' in document) { e = e.touches[0]; }
    var updatePosition:boolean|number[][] = false;
    var dragPosition = getPosition(param.dragBrick.dom);
    var tablePosition = getPosition(table.dom);
    if (dragPosition.x < tablePosition.x - squareWidth / 2 || dragPosition.y < tablePosition.y - squareWidth / 2 || dragPosition.x - table.dom.offsetWidth > tablePosition.x + squareWidth / 2 || dragPosition.y - table.dom.offsetHeight > tablePosition.y + squareWidth / 2) {
        updatePosition = false; //越界
    } else {
        updatePosition = table.checkNoCover(param.dragBrick, Math.round((dragPosition.y - tablePosition.y) / squareWidth), Math.round((dragPosition.x - tablePosition.x) / squareWidth));
    }
    //删掉dragBrick
    param.dragBrick.remove();
    if (updatePosition) {
        param.currentBrick.remove();
        //更新blockList
        if (immediate || brickList.isEmpty()) {
            brickList.reCreate();
        }
        //更新table
        table.update(updatePosition, param.dragBrick.color);
        var clearPosition = table.needClear();
        if (clearPosition[0].length || clearPosition[1].length) {
            setTimeout(function () {
                try {
                  table.clear(clearPosition[0], clearPosition[1]);
                } catch {}
              }, 100); //不知道为什么必须延迟才有动画效果
  
            score += getScore(clearPosition[0].length + clearPosition[1].length);
            const scoreElement = document.getElementById('score') 
            if(scoreElement) scoreElement.innerHTML = score.toString();
           
        }
        //game over
        var notOver = table.checkPossible(brickList);
        if (!notOver) {
            const titleInf = document.getElementById('titleInfo')
            if(titleInf) titleInf.innerHTML ="game over";

           const info = document.getElementById('info')
           if(info) info.innerHTML='block';
           table.clearAll();
           const gameOverEvent = new CustomEvent("gameOver", { detail: { score: score } });
           document.dispatchEvent(gameOverEvent);
           
        }
    } else {
        param.currentBrick.show();
    }
    //异常鼠标事件
    document.onmouseup = null;
    document.onmousemove = null;
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', up);
}
function getScore(num:number) {
    return Math.pow(2, (num - 1));
}


function move(e:any) {
    e.preventDefault();
    if ('ontouchend' in document) { e = e.touches[0]; }
    var tx = page.pageX(e) - param.x;
    var ty = page.pageY(e) - param.y;
    param.dragBrick.dom.style.left = tx + "px";
    param.dragBrick.dom.style.top = ty + "px";
}


const info = document.getElementById('info')
if (info) info.style.display = 'none';

    /**
     * game start
     */
    //init table
    var tableRow = 8;

    var table = new Table(gameWidth, tableRow, tableCol);

    //init bircks
    var brickAmount = 3;
    var brickList = new BrickList(gameWidth, brickAmount);

    //immediate create brick
    var immediate = false;

    
    var score = 0;

    

    document.addEventListener("gameStart", () => {
        score = 0;

        const titleInf = document.getElementById("titleInfo");
        if (titleInf) titleInf.innerHTML = "1010!";
        brickList.reCreate();

      });
      const gameStartEvent = new CustomEvent("gameStart", {});
      document.dispatchEvent(gameStartEvent);




    