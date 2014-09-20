
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
    var email = document.getElementById('register-email').value;
    var password = document.getElementById('register-password').value;
    var password2 = document.getElementById('register-password2').value;
    
    if (email.length ==0 || password.length == 0 || password2.length == 0) {
        alert('Please type someting..');
        return
    }
    
    if (password != password2) {
        alert('Your passwords are not equals..');
        return
    }
    
    register(email, password, function() {
        console.log('Callback');
    });
    setTimeout(function() {
        window.location = "login.html";
    }, 3000);

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