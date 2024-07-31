//La variable de config pour firebase
const firebaseConfig = {
    apiKey: "AIzaSyDk2ij3kRo0NmFwMXX_efoRUOo0x_MFENo",
    authDomain: "mon-hub-js-bdd-ffcbb.firebaseapp.com",
    databaseURL: "https://mon-hub-js-bdd-ffcbb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mon-hub-js-bdd-ffcbb",
    storageBucket: "mon-hub-js-bdd-ffcbb.appspot.com",
    messagingSenderId: "552190442631",
    appId: "1:552190442631:web:78c7afe83d640b337f8c22"
  };
    //initialiser bdd
  firebase.initializeApp(firebaseConfig);
  //On va créer une référence à notre BDD
  //on crée 'table' pour users  et annonces => tables se nomment références dans firebase
  
  const dbRef = firebase.database().ref();
  // On va également faire une ref directement dans le noeud / """"table""""" users
  const usersRef = dbRef.child("users");
  
  
  const addUserBtnUI = document.getElementById("add-user-btn");
  addUserBtnUI.addEventListener("click", addUserBtnClicked);
  
  const formUserUI = document.getElementById("add-user-form");
  formUserUI.addEventListener("submit", (event) => event.preventDefault());
  
  const formUserEditUI = document.getElementById("edit-user-module");
  formUserEditUI.addEventListener("submit", (event) => event.preventDefault());
  
  const userListUI = document.getElementById("user-list");
  const userDetailUI = document.getElementById("user-detail");

  const addUserInputsUI = document.getElementsByClassName("user-input");
  
  readUserData();
  
  function addUserBtnClicked() {
    let newUser={};
    for(let i=0; i<addUserInputsUI.length; i++){
        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        newUser[key] = value;
    }
    usersRef.push(newUser);
    console.log("Nouvel utilisateur enregistré");
    console.log(`Nom: ${newUser["name"]}, Age: ${newUser["age"]}`);
 
  };
  
/*   function readUserData() {
    usersRef.on("value",(snap) => {
        userListUI.innerHTML = "";
        snap.forEach((childSnap)=>{
            let key = childSnap.key;
            let value = childSnap.val();
            const $li = document.createElement("li");
            $li.innerHTML = value.name;
            $li.setAttribute("user-key", key);
            $li.addEventListener("click",userClicked);
            userListUI.append($li);
        })
    });
  
  }; */

  function readUserData() {
    // Au moindre changement de value, on fera la lecture de la BDD
    // .on() de firebase equiv à un addEventListener spécialisé BDD
    usersRef.on('value',(snap)=>{
        // Parano on vide la list HTML au cas ou 
        userListUI.innerHTML = "";
        // Sur toutes les données des USERS on boucle /  parcours
        // pour récuperer les clé et valeurs surtout
        snap.forEach(childSnap => {
            let key = childSnap.key;
            let value = childSnap.val();
            let $li = document.createElement('li');
            let editIconUI = document.createElement('button');
            editIconUI.innerText = 'Update'
            editIconUI.setAttribute('class','btn btn-outline-primary mx-3');
            //* Sur les icone en face du nom du user on rajoute un attribut qui contient la key
            editIconUI.setAttribute("userid", key);
            editIconUI.addEventListener("click", editButtonClicked);
            // On place les clé dans le DOM (si on les recup plus tard)
            $li.setAttribute("user-key", key);
            // Dans value on aura .name, .mail, .age 
            // dans la liste on affichera juste le .name
            $li.innerText = value.name;
            $li.append(editIconUI);

            // On place dans la userList
            $li.addEventListener("click", userClicked);
            userListUI.append($li)
        });
    })
};
  
  function userClicked(event) {
    let userID = event.target.getAttribute("user-key");
    let userRef = dbRef.child("users/"+userID);
    userRef.on("value", snap =>{
        userDetailUI.innerHTML = "";
        snap.forEach((childSnap) => {
          const $p = document.createElement("p");
          $p.innerHTML = `${childSnap.key} : ${childSnap.val()}`;
          userDetailUI.append($p);
        })
    })


  };
  const $inputId = document.querySelector(".edit-userid");
  const editUserInputsUI = document.querySelectorAll(".edit-user-input");

  function editButtonClicked(event) {
    formUserEditUI.style.display = "block";
    formUserUI.style.display = "none";
    
    $inputId.value = event.target.getAttribute("userid");
    let userRef = dbRef.child('users/' + $inputId.value);
    //let editUserInputsUI = document.querySelectorAll(".edit-user-input");

    userRef.on("value", snap => {
      for(let i=0; i<editUserInputsUI.length; i++){
        let key = editUserInputsUI[i].getAttribute("data-key");
        editUserInputsUI[i].value = snap.val()[key];
      }
    })

    const $saveBtn = document.querySelector("#edit-user-btn");
    $saveBtn.addEventListener("click", saveUserBtnClicked);
  };
  

  function saveUserBtnClicked() {
    let userID = $inputId.value;
    let userRef = dbRef.child('users/'+userID);
    let editedUserObject ={};
    editUserInputsUI.forEach(function(textField){
      let key = textField.getAttribute("data-key");
      editedUserObject[key] = textField.value;
    })
    userRef.update(editedUserObject);
    formUserEditUI.style.display = "none";
    formUserEditUI.style.display ="block";
  };
  
  function deleteButtonClicked(event) {
  
  }