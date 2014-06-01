function HighScores() {

    this.uid = 'p0000001389';
    this.authcode = '-';
    this.rdb = new SQLEngine(this.uid, this.authcode, 'www.rdbhost.com');
    
    this.latestId;
    
    this.tableHighscores = document.getElementById('table-highscores');
};

HighScores.prototype.saveScore = function(name, score) {
    var self = this;

    var data = [ null, name, score, new Date().toDateString(), 'ip here'];
    this.addTableData('scores', data, function() {
        self.showScores();
    });
};

HighScores.prototype.showScores = function() {
    var self = this;
    
    this.getTableData('scores', 'ORDER BY score DESC LIMIT 10', function(success) {
        // Callback
        var results = success.records.rows;
        
        var tbody = document.createElement('tbody');
        
        for (var row in results) {
            var result = results[row];
            
            var currentTr = self.createResultTableRow(result, row);
            tbody.appendChild(currentTr);
        }
        
        var oldTBody = self.tableHighscores.getElementsByTagName('tbody')[0];
        self.tableHighscores.replaceChild(tbody, oldTBody);
        //self.tableHighscores = tbody;
    });
}

HighScores.prototype.createResultTableRow = function(row, number) {
    var tr = document.createElement('tr');
    var tdId = document.createElement('td');
    var tdName = document.createElement('td');
    var tdScore = document.createElement('td');
    
    tdId.innerHTML = parseInt(number)+1;
    tdName.innerHTML = row[1];
    tdScore.innerHTML = row[2];
    
    var name = $.cookie('name');
    if (row[1] == name) {
        tr.className = 'mine';
    }
    console.log(name);
    console.log(row[1]);
    
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdScore);
    
    return tr;
}

HighScores.prototype.getTableData = function(table, options, callback) {
        var query = 'SELECT * FROM '+table+' '+options;
        var res2 = this.rdb.query( {
            'callback' : callback,
            'q' : query } );
    };
    
HighScores.prototype.addTableData = function(table, data, callback) {
    var self = this;
    this.getTableData(table, 'ORDER BY id DESC LIMIT 1', function(success) {
        console.log(data);
        if (success.records.rows)
            data[0] = (parseInt(success.records.rows[0][0]))+1;
        else 
            data[0] = 1;
        latestId = data[0];

        var query = 'INSERT INTO '+table+' VALUES (%s, %s, %s, %s, %s)';
        console.log(data);

        console.log(query);
        var res = self.rdb.query( {
            'callback' : callback,
            'q' : query,
            'args': data} );  
    }) + 1;
};