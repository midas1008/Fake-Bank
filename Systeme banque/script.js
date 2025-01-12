// Base de données fictive (en mémoire)
let comptes = {};
let idCounter = 1; // Générateur d'ID unique

// Fonction pour générer un identifiant unique
function genererId() {
    return `ID-${idCounter++}`;
}

// Fonction pour afficher les messages
function afficherMessage(message, isError = false) {
    const messageDiv = document.getElementById("message");
    messageDiv.style.color = isError ? "red" : "green";
    messageDiv.textContent = message;
    setTimeout(() => (messageDiv.textContent = ""), 3000);
}

// Fonction pour afficher les comptes
function afficherComptes() {
    const accountsList = document.getElementById("accountsList");
    accountsList.innerHTML = Object.entries(comptes)
        .map(([id, compte]) => `<p>${id} - ${compte.nom}: ${compte.solde}€</p>`)
        .join("");
}

// Vérifie si le mot de passe est correct
function verifierMotDePasse(id, motDePasse) {
    return comptes[id] && comptes[id].motDePasse === motDePasse;
}

// Gestion de la création d'un compte
document.getElementById("createAccountForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nom = document.getElementById("accountName").value;
    const soldeInitial = parseFloat(document.getElementById("initialBalance").value);
    const motDePasse = document.getElementById("accountPassword").value;

    if (soldeInitial < 0) {
        afficherMessage("Le solde initial doit être positif.", true);
    } else if (!motDePasse) {
        afficherMessage("Le mot de passe est requis.", true);
    } else {
        const id = genererId();
        comptes[id] = { nom, solde: soldeInitial, motDePasse };
        afficherMessage(`Compte créé pour ${nom} avec l'ID ${id}.`);
        afficherComptes();
    }

    this.reset();
});

// Gestion des dépôts
document.getElementById("depositForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("depositId").value;
    const motDePasse = document.getElementById("depositPassword").value;
    const montant = parseFloat(document.getElementById("depositAmount").value);

    if (!comptes[id]) {
        afficherMessage("Compte introuvable.", true);
    } else if (!verifierMotDePasse(id, motDePasse)) {
        afficherMessage("Mot de passe incorrect.", true);
    } else if (montant <= 0) {
        afficherMessage("Montant invalide.", true);
    } else {
        comptes[id].solde += montant;
        afficherMessage(`${montant}€ déposé sur le compte ${id}.`);
        afficherComptes();
    }

    this.reset();
});

// Gestion des retraits
document.getElementById("withdrawForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("withdrawId").value;
    const motDePasse = document.getElementById("withdrawPassword").value;
    const montant = parseFloat(document.getElementById("withdrawAmount").value);

    if (!comptes[id]) {
        afficherMessage("Compte introuvable.", true);
    } else if (!verifierMotDePasse(id, motDePasse)) {
        afficherMessage("Mot de passe incorrect.", true);
    } else if (montant <= 0 || montant > comptes[id].solde) {
        afficherMessage("Montant invalide ou solde insuffisant.", true);
    } else {
        comptes[id].solde -= montant;
        afficherMessage(`${montant}€ retiré du compte ${id}.`);
        afficherComptes();
    }

    this.reset();
});

// Gestion des virements
document.getElementById("transferForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const sourceId = document.getElementById("sourceId").value;
    const motDePasse = document.getElementById("sourcePassword").value;
    const destinationId = document.getElementById("destinationId").value;
    const montant = parseFloat(document.getElementById("transferAmount").value);

    if (!comptes[sourceId] || !comptes[destinationId]) {
        afficherMessage("Compte source ou destinataire introuvable.", true);
    } else if (!verifierMotDePasse(sourceId, motDePasse)) {
        afficherMessage("Mot de passe du compte source incorrect.", true);
    } else if (montant <= 0 || montant > comptes[sourceId].solde) {
        afficherMessage("Montant invalide ou solde insuffisant.", true);
    } else {
        comptes[sourceId].solde -= montant;
        comptes[destinationId].solde += montant;
        afficherMessage(`Virement de ${montant}€ effectué de ${sourceId} vers ${destinationId}.`);
        afficherComptes();
    }

    this.reset();
});
