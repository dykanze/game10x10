// random color
export let color = {
    default: 'default',
    colorList: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'],
    random: function() {
        return this.colorList[Math.floor(Math.random() * this.colorList.length)];
    }
};

//create matrix
export let matrix = {
    matrixList: [
        //one block
        [[1]],
        //row
        [[1,1,1,1,1]],
        [[1,1,1,1]],
        [[1,1,1]],
        [[1,1]],
        //column
        [[1],[1],[1],[1],[1]],
        [[1],[1],[1],[1]],
        [[1],[1],[1]],
        [[1],[1]],
        //2*2 blocks
        [[1,1],[1,1]],
        [[1,1],[1,0]],
        [[1,1],[0,1]],
        [[1,0],[1,1]],
        [[0,1],[1,1]],
        //3*3 blocks
        [[1,1,1],[1,1,1],[1,1,1]],
        [[1,1,1],[1,0,0],[1,0,0]],
        [[1,1,1],[0,0,1],[0,0,1]],
        [[1,0,0],[1,0,0],[1,1,1]],
        [[0,0,1],[0,0,1],[1,1,1]]
    ],
    random: function() {
        return this.matrixList[Math.floor(Math.random() * this.matrixList.length)];
    }
};


// state storage
export let param = {
    dragBrick:null,
    currentBrick:null,
    x:null,
    y:null
} as Record<string,any>

// calculation coordinate
export let getPosition = (e:any) =>  {
    var x = 0,
        y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return { x: x, y: y };
}

export let  page = {
    event: function(evt:any) {
        var ev = evt || window.event;
        return ev;
    },
    pageX: function(evt:any) {
        var e = this.event(evt);
        return e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
    },
    pageY: function(evt:any) {
        var e = this.event(evt);
        return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);

    },
    layerX: function(evt:any) {
        var e = this.event(evt);
        return e.layerX || e.offsetX;
    },
    layerY: function(evt:any) {
        var e = this.event(evt);
        return e.layerY || e.offsetY;
    }
}
