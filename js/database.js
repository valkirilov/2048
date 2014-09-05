
var userProfile, userRef;
var firebaseRef = new Firebase('https://valkirilov-2048.firebaseio.com/');
var firebaseAuth = new FirebaseSimpleLogin(firebaseRef, function(error, user) {
    var hrefs = window.location.href.split('/');
    var href = hrefs[hrefs.length-1];
    
    if (error) {
        console.log('Authentication error: ', error);
    } else if (user) {
        console.log('User ' + user.id + '.' + user.email + ' is authenticated via the ' + user.provider + ' provider!');

        userProfile = user;
        
        var ref = new Firebase('https://valkirilov-2048.firebaseio.com/users/'+user.uid);
        ref.on('value', function(snapshot) {
            userRef = snapshot.val();  
            showXp();
        });

        
        console.log(href);
        if (href.indexOf('index.html') != -1 ||
          href.indexOf('login.html') != -1 ||
           href.indexOf('register.html') != -1) {
            window.location = "game.html";
        }
    } else {
        console.log("User is logged out.")

        userProfile = null;
        if (href.indexOf('game.html') != -1) {
            window.location = "index.html";
        }
    }
});

function registerButton() {
    alert('reg');
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    
    register(email, password);
}

function loginButton() {
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    
    login(email, password);
}

function register(email, password) {
    // Filter input
    
    firebaseAuth.createUser(email, password, function(error, user) {
        if (error === null) {
            console.log("User created successfully:", user);
            firebaseRef.child('users').child(user.uid).set({
                displayName: user.email,
                provider: user.provider,
                provider_id: user.id,
                xp: 0,
                level: 0,
                money: 0,
                games: 0,
                bestScore: 0,
                bestTile: 0
            });
        } else {
            console.log("Error creating user:", error);
        }
    });
}

function login(email, password) {
    // Filter input
    
    firebaseAuth.login('password', {
        email: email,
        password: password
    });
}

function logout() {
    firebaseAuth.logout();
}

function showXp(xp) {
    xp = xp || userRef.xp;
    document.getElementById('field-xp').innerHTML = xp;
}