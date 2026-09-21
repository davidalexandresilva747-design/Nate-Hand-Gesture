/* =========================================================
   NATE HAND GESTURE — PARTY [01]
   party01.js

   Cette PARTY gère :
   - L'arrivée dans l'ascenseur
   - Le dialogue du joueur
   - Les pensées
   - L'ouverture de l'ascenseur
   - L'apparition de l'inconnue
   - Le choix du joueur
   - La bonne route vers [02]
   - La mauvaise route vers [01.5]

   Le moteur principal doit déjà avoir chargé :
   - DOM
   - ASSETS
   - AUDIO
   - PARTY
   - fonctions communes
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       VARIABLES
       ===================================================== */

    let dialogueIndex = 0;
    let goodEndingIndex = 0;

    let phase = "intro";
    let ended = false;
    let busy = false;

    /*
       Phases possibles :

       intro
       opening
       strangePerson
       choice
       goodEnding
       finished
    */


    /* =====================================================
       DIALOGUE INTRO
       ===================================================== */

    const dialogue = [

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "Je suis vraiment fatigué..."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "J'ai juste envie de rentrer chez moi."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "......."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "..........."
        },

        {
            type: "thought",
            text: "(C'est bizarre... je me rappelle pas que ça prenait autant de temps de monter.)"
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "......."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "J'espère qu'on va bientôt arriver."
        }

    ];


    /* =====================================================
       DIALOGUE APRÈS OUVERTURE
       ===================================================== */

    const strangePersonDialogue = [

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "..."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "Je ne crois pas vous avoir déjà vue ici."
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "Vous venez d'emménager ?"
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "..."
        },

        {
            type: "thought",
            text: "(Elle a quelque chose d'étrange...)"
        },

        {
            type: "thought",
            text: "(Son apparence est complètement noire.)"
        },

        {
            type: "thought",
            text: "(Et... son visage ?)"
        },

        {
            type: "player",
            name: "Geliebte Tochter",
            text: "Vous allez au même étage que moi ?"
        }

    ];


    /* =====================================================
       BONNE FIN
       ===================================================== */

    const goodEndingDialogue = [

        {
            type: "nate",
            name: "Nate",
            text: "..."
        },

        {
            type: "nate",
            name: "Nate",
            text: "C'est rare que quelqu'un laisse la porte ouverte."
        },

        {
            type: "nate",
            name: "Nate",
            text: "Merci."
        },

        {
            type: "nate",
            name: "Nate",
            text: "Je peux peut-être vous accompagner."
        },

        {
            type: "nate",
            name: "Nate",
            text: "J'aimerais bien discuter un peu avec vous."
        },

        {
            type: "nate",
            name: "Nate",
            text: "Ça ne vous dérange pas... ?"
        }

    ];


    /* =====================================================
       OUTILS
       ===================================================== */

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function safeCall(fn, ...args) {
        try {
            if (typeof fn === "function") {
                return fn(...args);
            }
        } catch (error) {
            console.error("[PARTY 01] Erreur :", error);
        }
    }


    /* =====================================================
       AFFICHAGE DIALOGUE
       ===================================================== */

    function showDialogue(data) {

        if (!data || !window.DOM) return;

        const DOM = window.DOM;

        /*
           On utilise les éléments déjà présents dans
           l'interface principale.
        */

        if (DOM.dialogueBox) {
            DOM.dialogueBox.classList.remove("hidden");
        }

        if (DOM.dialogueName) {
            DOM.dialogueName.textContent = "";
        }

        if (DOM.dialogueText) {
            DOM.dialogueText.textContent = "";
        }


        /* ---------------------------------------------
           NOM
           --------------------------------------------- */

        if (data.type === "thought") {

            if (DOM.dialogueName) {
                DOM.dialogueName.textContent = "";
            }

        } else {

            if (DOM.dialogueName) {
                DOM.dialogueName.textContent = data.name || "";
            }

        }


        /* ---------------------------------------------
           TEXTE
           --------------------------------------------- */

        if (DOM.dialogueText) {

            DOM.dialogueText.textContent = data.text || "";

        }
    }


    /* =====================================================
       DIALOGUE SUIVANT
       ===================================================== */

    function nextDialogue() {

        if (busy || ended) return;

        if (phase === "intro") {

            if (dialogueIndex < dialogue.length) {

                showDialogue(dialogue[dialogueIndex]);

                dialogueIndex++;

                return;
            }

            /*
               Fin de l'introduction.
               On passe à l'ouverture de l'ascenseur.
            */

            phase = "opening";

            openLift();

            return;
        }


        if (phase === "strangePerson") {

            if (dialogueIndex < strangePersonDialogue.length) {

                showDialogue(
                    strangePersonDialogue[dialogueIndex]
                );

                dialogueIndex++;

                return;
            }

            /*
               Fin du dialogue avec l'inconnue.
            */

            phase = "choice";

            showChoice();

            return;
        }


        if (phase === "goodEnding") {

            if (goodEndingIndex < goodEndingDialogue.length) {

                showDialogue(
                    goodEndingDialogue[goodEndingIndex]
                );

                goodEndingIndex++;

                return;
            }

            finishGoodEnding();

            return;
        }
    }


    /* =====================================================
       OUVERTURE DE L'ASCENSEUR
       ===================================================== */

    async function openLift() {

        if (busy) return;

        busy = true;

        /*
           On masque le dialogue pendant la transition.
        */

        if (window.DOM && DOM.dialogueBox) {
            DOM.dialogueBox.classList.add("hidden");
        }

        /*
           Petite pause pour donner un effet de transition.
        */

        await sleep(500);


        /*
           Ascenseur ouvert.
        */

        safeCall(window.setBackgroundLiftOpen);


        await sleep(900);


        /*
           On recommence le dialogue.
        */

        dialogueIndex = 0;
        phase = "strangePerson";

        busy = false;

        nextDialogue();
    }


    /* =====================================================
       CHOIX
       ===================================================== */

    function showChoice() {

        if (!window.DOM) return;

        const DOM = window.DOM;


        /*
           On cache le dialogue normal.
        */

        if (DOM.dialogueBox) {
            DOM.dialogueBox.classList.add("hidden");
        }


        /*
           L'interface de choix utilise les boutons déjà
           présents dans le moteur.
        */

        if (DOM.choiceBox) {
            DOM.choiceBox.classList.remove("hidden");
        }

        if (DOM.choiceTitle) {
            DOM.choiceTitle.textContent = "Que faire ?";
        }

        if (DOM.choice1) {
            DOM.choice1.textContent = "Bloquer la porte";
            DOM.choice1.classList.remove("hidden");
        }

        if (DOM.choice2) {
            DOM.choice2.textContent = "Laisser la porte se fermer";
            DOM.choice2.classList.remove("hidden");
        }
    }


    /* =====================================================
       CACHER CHOIX
       ===================================================== */

    function hideChoice() {

        if (!window.DOM) return;

        const DOM = window.DOM;

        if (DOM.choiceBox) {
            DOM.choiceBox.classList.add("hidden");
        }

        if (DOM.choice1) {
            DOM.choice1.classList.add("hidden");
        }

        if (DOM.choice2) {
            DOM.choice2.classList.add("hidden");
        }
    }


    /* =====================================================
       CHOIX 1
       BLOQUER LA PORTE
       ===================================================== */

    async function blockDoor() {

        if (busy || ended) return;

        busy = true;

        hideChoice();


        /*
           Son de clic si le moteur en possède un.
        */

        if (typeof window.playClick === "function") {
            window.playClick();
        }


        /*
           Nate devient heureuse.
        */

        if (window.ASSETS && window.ASSETS.nateHappy) {

            safeCall(
                window.setNate,
                window.ASSETS.nateHappy
            );

            safeCall(window.showNate);

        }


        await sleep(500);


        /*
           Passage au dialogue de la bonne route.
        */

        phase = "goodEnding";
        goodEndingIndex = 0;

        busy = false;

        nextDialogue();
    }


    /* =====================================================
       CHOIX 2
       LAISSER LA PORTE SE FERMER
       ===================================================== */

    async function letDoorClose() {

        if (busy || ended) return;

        busy = true;

        hideChoice();


        if (typeof window.playClick === "function") {
            window.playClick();
        }


        await sleep(600);


        /*
           Charge PARTY [01.5]
        */

        await goToParty015();

    }


    /* =====================================================
       FIN DE LA BONNE ROUTE
       ===================================================== */

    async function finishGoodEnding() {

        if (ended) return;

        ended = true;
        phase = "finished";


        if (window.DOM && DOM.dialogueBox) {
            DOM.dialogueBox.classList.add("hidden");
        }


        await sleep(700);


        await goToParty02();
    }


    /* =====================================================
       ALLER À PARTY [01.5]
       ===================================================== */

    async function goToParty015() {

        /*
           On utilise le loader central.
        */

        try {

            window.PARTY.current = "1.5";


            /*
               Fade écran.
            */

            if (
                window.DOM &&
                DOM.fade
            ) {

                DOM.fade.classList.add("active");

                await sleep(500);
            }


            /*
               Charge le fichier [01.5].
            */

            if (typeof window.loadPartyScript === "function") {

                await window.loadPartyScript("1.5");

            }


            /*
               Nettoyage.
            */

            if (window.DOM && DOM.dialogueBox) {
                DOM.dialogueBox.classList.add("hidden");
            }

            hideChoice();


            /*
               Lance [01.5].
            */

            if (
                typeof window.party015_Start === "function"
            ) {

                window.party015_Start();

            } else {

                console.warn(
                    "[PARTY 01] party015_Start() introuvable."
                );

            }


            if (
                window.DOM &&
                DOM.fade
            ) {

                await sleep(150);

                DOM.fade.classList.remove("active");

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Impossible de charger [01.5] :",
                error
            );

        }

    }


    /* =====================================================
       ALLER À PARTY [02]
       ===================================================== */

    async function goToParty02() {

        try {

            window.PARTY.current = 2;


            /*
               Fade.
            */

            if (
                window.DOM &&
                DOM.fade
            ) {

                DOM.fade.classList.add("active");

                await sleep(700);
            }


            /*
               Charge [02].
            */

            if (typeof window.loadPartyScript === "function") {

                await window.loadPartyScript(2);

            }


            /*
               Nettoyage.
            */

            if (window.DOM && DOM.dialogueBox) {
                DOM.dialogueBox.classList.add("hidden");
            }

            hideChoice();


            /*
               Lance PARTY [02].
            */

            if (
                typeof window.party02_Start === "function"
            ) {

                window.party02_Start();

            } else {

                console.warn(
                    "[PARTY 01] party02_Start() introuvable."
                );

            }


            if (
                window.DOM &&
                DOM.fade
            ) {

                await sleep(200);

                DOM.fade.classList.remove("active");

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Impossible de charger [02] :",
                error
            );

        }

    }


    /* =====================================================
       CLICK GLOBAL DIALOGUE
       ===================================================== */

    function handleDialogueClick() {

        if (window.PARTY.current !== 1) {
            return;
        }

        if (phase === "choice") {
            return;
        }

        nextDialogue();
    }


    /* =====================================================
       BRANCHEMENT DES BOUTONS
       ===================================================== */

    function connectChoiceButtons() {

        if (!window.DOM) return;

        const DOM = window.DOM;


        /*
           Bouton 1
        */

        if (DOM.choice1) {

            DOM.choice1.onclick = function(event) {

                event.stopPropagation();

                blockDoor();

            };

        }


        /*
           Bouton 2
        */

        if (DOM.choice2) {

            DOM.choice2.onclick = function(event) {

                event.stopPropagation();

                letDoorClose();

            };

        }
    }


    /* =====================================================
       START PARTY [01]
       ===================================================== */

    window.party01_Start = function() {

        console.log(
            "%c[PARTY 01] START",
            "color:#fff;background:#000;padding:4px 8px;"
        );


        /*
           État global.
        */

        window.PARTY.current = 1;


        /*
           Reset.
        */

        dialogueIndex = 0;
        goodEndingIndex = 0;

        phase = "intro";

        ended = false;
        busy = false;


        /*
           Ascenseur fermé.
        */

        safeCall(window.setBackgroundLift);


        /*
           Nate n'est pas présent dans cette scène.
        */

        safeCall(window.hideNate);


        /*
           Cache le choix.
        */

        hideChoice();


        /*
           Affiche le dialogue.
        */

        if (window.DOM && DOM.dialogueBox) {
            DOM.dialogueBox.classList.remove("hidden");
        }


        /*
           Branche les boutons.
        */

        connectChoiceButtons();


        /*
           Musique PARTY [01].
        */

        if (
            typeof window.switchToIntroMusic === "function"
        ) {

            window.switchToIntroMusic();

        } else if (
            typeof window.startIntroMusic === "function"
        ) {

            window.startIntroMusic();

        }


        /*
           Premier dialogue.
        */

        nextDialogue();


        /*
           Click sur la zone de dialogue.
        */

        if (window.DOM && DOM.dialogueBox) {

            DOM.dialogueBox.onclick = function(event) {

                /*
                   Si le clic provient d'un bouton de choix,
                   on ne traite pas le dialogue.
                */

                if (
                    event.target &&
                    (
                        event.target === DOM.choice1 ||
                        event.target === DOM.choice2
                    )
                ) {
                    return;
                }

                handleDialogueClick();

            };

        }

    };


    /* =====================================================
       EXPORTS
       ===================================================== */

    window.party01_NextDialogue = nextDialogue;

    window.party01_BlockDoor = blockDoor;

    window.party01_LetDoorClose = letDoorClose;

    window.party01_GoToParty015 = goToParty015;

    window.party01_GoToParty02 = goToParty02;


    /* =====================================================
       READY
       ===================================================== */

    console.log(
        "%c[PARTY 01] party01.js chargé.",
        "color:#00ff66;background:#050505;padding:4px 8px;"
    );

})();