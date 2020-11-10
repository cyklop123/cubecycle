exports = module.exports = function(type)
{
    switch(type)
    {
        case '3x3':
            return generateScramble(20,3)
            break;
        case '4x4':
            return generateScramble(40,4)
            //return "L U F' U L2 F2 D L2 U' F2 U2 L2 U' F2 L F' L' B L' U2 L' Fw2 D F' Rw2 D2 Fw2 Uw2 U2 B Uw2 F2 R2 D Rw D' Rw L D' Fw' Rw Uw' L2 U2 Fw Uw"
            break;    
        case '5x5':
            return generateScramble(40,5)
            //return "Bw D L' Bw D2 Dw2 Lw U' D2 Lw' Uw Bw2 Rw B' Lw' U Lw' R' L2 D' Dw Uw Bw2 D' F2 Rw Uw' Lw2 B' U' Bw Dw' B' R' Bw2 F2 Rw2 Dw' D' Lw Bw2 D' Lw2 Bw F2 R' Bw B2 R2 B2 F Uw2 L Fw D' Lw R2 Bw Fw2 Uw"
            break;

        default:
            return "Not valid room type."
    }
}

function generateScramble(n, dim) {
    let scramble = [];
    for(let i=0; i<n; i++)
    {
        let move;
        do{
            move = randMove();
        }
        while(i>0 && planeCompare(scramble[i-1], move));
        if(dim > 3 && Math.random() > 0.5)
            move += 'w'            
        if(Math.random()>0.66)
            move += '2';
        else if(Math.random()>0.5)
            move += "'";
        scramble.push(move);
    }
    return scramble.join(' ');
}


function randMove() {
    switch (parseInt(Math.random()*6)) {
        case 0:
            return 'U';
            break;
        case 1:
            return 'D';
            break;
        case 2:
            return 'R';
            break;
        case 3:
            return 'L';
            break;
        case 4:
            return 'F';
            break;
        case 5:
            return 'B';
            break;
        default:
            return '';
    }
}

function planeCompare(prev, act)
{
    if(plane(prev.replace(/[2']/g,'')) == plane(act.replace(/[2']/g,'')))
        return true;
    return false;
}

function plane(move)
{
    if(move == 'U' || move=='D')
        return 'x';
    if(move == 'L' || move=='R')
        return 'y';
    if(move == 'F' || move=='B')
        return 'z';
    return 'e';
}
