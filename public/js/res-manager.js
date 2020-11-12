class ResultManager
{
    constructor(thead,tbody, users)
    {
        this.thead = thead;
        this.tbody = tbody;
        this.LP = 0;
        this._addColumn('On.')
        this.users = []
        for(var i=1; i<=users.length; i++)
        {
            this._addColumn(users[i-1])
            this.users.push({login: users[i-1], col: i})
        }
    }

    addUser(login)
    {
        this._addColumn(login)
        this.users.push({login: login, col: this.users.length+1})
    }

    removeUser(login)
    {
        let usrIndex = this.users.findIndex(usr => usr.login === login)
        let removed = this.users.splice(usrIndex, 1)[0]
        for(var i=0; i<this.users.length; i++)
        {
            if(this.users[i].col > removed.col)
                this.users[i].col--;
        }
        this._removeColumn(removed.col)
    }

    addRound()
    {
        this.tbody.children().eq(0).children().each(function(){
            if($(this).text() == "Pending")
                $(this).text('-')
        })
        this._addRow()
    }

    addTime(login, time)
    {
        let usrCol = this.users.find(usr => usr.login === login).col
        this.tbody.children().eq(0).children().eq(usrCol).text(time)
    }

    _addColumn(name)
    {
        this.thead.children().eq(0).append($(`<td>${name}</td>`))
        this.tbody.children().each(function() {
            $(this).append($(`<td> </td>`))
        });
        return this.thead.children().eq(0).length
    }

    _removeColumn(i)
    {
        this.thead.children().eq(0).children().eq(i).remove()
        this.tbody.children().each(function(){
            $(this).children().eq(i).remove()
        })
    }

    _addRow()
    {
        this.LP++
        let tr = $(`<tr></tr>`)
        tr.append(`<td>${this.LP}</td>`)
        this.users.forEach(user => tr.append('<td>Pending</td<'))
        this.tbody.prepend(tr)
    }
}
