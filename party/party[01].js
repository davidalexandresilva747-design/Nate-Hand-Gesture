(() => {
    "use strict";

    /*
     * ============================================================
     * NATE HAND GESTURE
     * PARTY [01]
     * ============================================================
     *
     * Cette PARTY contient :
     *
     * 01. Arrivée dans l'ascenseur
     * 02. Ouverture de l'ascenseur
     * 03. Rencontre avec Nate
     * 04. Choix du joueur
     * 05. Bonne route
     * 06. Route [01.5]
     * 07. Route [02]
     *
     * ============================================================
     */

    console.log("[PARTY 01] Initialisation...");

    /* ============================================================
       REFERENCES
       ============================================================ */

    const DOM = window.DOM;
    const ASSETS = window.ASSETS;
    const PARTY = window.PARTY;

    /* ============================================================
       STATE
       ============================================================ */

    let dialogueIndex = 0;
    let goodEndingIndex = 0;

    let phase = "intro";

    let ended = false;
    let busy = false;

    let choicesConnected = false;
    let dialogueConnected = false;

    /* ============================================================
       SAFETY
       ============================================================ */

    function safeCall(fn, ...args) {
        try {
            if (typeof fn === "function") {
                return fn(...args);
            }
        } catch (error) {
            console.error("[PARTY 01] Erreur :", error);
        }
    }

    function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    /* ============================================================
       INTRO DIALOGUE
       ============================================================ */

    const introDialogue = [

        {
            type: "nate",
            name: "Nate",
            text: "Je suis vraiment fatigué..."
        },

        {
            type: "nate",
            name: "Nate",
            text: "J'ai juste envie de rentrer chez moi."
        },

        {
            type: "nate",
            name: "Nate",
            text: "......."
        },

        {
            type: "nate",
            name: "Nate",
            text: "..........."
        },

        {
            type: "thought",
            text:
                "(C'est bizarre... je me rappelle pas que ça prenait autant de temps de monter.)"
        },

        {
            type: "nate",
            name: "Nate",
            text: "......."
        },

        {
            type: "nate",
            name: "Nate",
            text: "J'espère qu'on va bientôt arriver."
        }

    ];

    /* ============================================================
       STRANGE PERSON DIALOGUE
       ============================================================ */

    const strangePersonDialogue = [

        {
            type: "nate",
            name: "Nate",
            text: "..."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je ne crois pas vous avoir déjà vue ici."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Vous venez d'emménager ?"
        },

        {
            type: "nate",
            name: "Nate",
            text: "..."
        },

        {
            type: "thought",
            text:
                "(Elle a quelque chose d'étrange...)"
        },

        {
            type: "thought",
            text:
                "(Son apparence est complètement noire.)"
        },

        {
            type: "thought",
            text:
                "(Et... son visage ?)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Vous allez au même étage que moi ?"
        }

    ];

    /* ============================================================
       GOOD ENDING DIALOGUE
       ============================================================ */

    const goodEndingDialogue = [

        {
            type: "nate",
            name: "Nate",
            text: "..."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "C'est rare que quelqu'un laisse la porte ouverte."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Merci."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je peux peut-être vous accompagner."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "J'aimerais bien discuter un peu avec vous."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Ça ne vous dérange pas... ?"
        }

    ];

    /* ============================================================
       DIALOGUE DISPLAY
       ============================================================ */

    function showDialogue(entry) {

        if (!entry) {
            return;
        }

        if (!DOM || !DOM.dialogueBox) {
            console.error(
                "[PARTY 01] DOM du dialogue introuvable."
            );
            return;
        }

        const name =
            entry.name || "";

        const text =
            entry.text || "";

        if (DOM.dialogueName) {
            DOM.dialogueName.textContent =
                name;
        }

        if (DOM.dialogueText) {
            DOM.dialogueText.textContent =
                text;
        }

        DOM.dialogueBox.classList.remove(
            "hidden"
        );

        /*
         * Les pensées n'affichent pas de nom.
         */
        if (entry.type === "thought") {

            if (DOM.dialogueName) {
                DOM.dialogueName.textContent =
                    "";
            }

            if (DOM.dialogueText) {
                DOM.dialogueText.style.fontStyle =
                    "italic";

                DOM.dialogueText.style.opacity =
                    "0.82";
            }

        } else {

            if (DOM.dialogueText) {
                DOM.dialogueText.style.fontStyle =
                    "normal";

                DOM.dialogueText.style.opacity =
                    "1";
            }

        }

    }

    /* ============================================================
       HIDE DIALOGUE
       ============================================================ */

    function hideDialogue() {

        if (
            DOM &&
            DOM.dialogueBox
        ) {

            DOM.dialogueBox.classList.add(
                "hidden"
            );

        }

    }

    /* ============================================================
       NEXT DIALOGUE
       ============================================================ */

    async function nextDialogue() {

        if (busy || ended) {
            return;
        }

        /*
         * --------------------------------------------------------
         * INTRO
         * --------------------------------------------------------
         */

        if (phase === "intro") {

            if (
                dialogueIndex <
                introDialogue.length - 1
            ) {

                dialogueIndex++;

                showDialogue(
                    introDialogue[
                        dialogueIndex
                    ]
                );

                safeCall(
                    window.playClickSound
                );

                return;
            }

            /*
             * Fin de l'intro
             */
            busy = true;

            await openLift();

            busy = false;

            return;
        }

        /*
         * --------------------------------------------------------
         * RENCONTRE
         * --------------------------------------------------------
         */

        if (phase === "strangePerson") {

            if (
                dialogueIndex <
                strangePersonDialogue.length - 1
            ) {

                dialogueIndex++;

                showDialogue(
                    strangePersonDialogue[
                        dialogueIndex
                    ]
                );

                safeCall(
                    window.playClickSound
                );

                return;
            }

            /*
             * Fin du dialogue :
             * affichage du choix.
             */

            showChoice();

            return;
        }

        /*
         * --------------------------------------------------------
         * BONNE ROUTE
         * --------------------------------------------------------
         */

        if (phase === "goodEnding") {

            if (
                goodEndingIndex <
                goodEndingDialogue.length - 1
            ) {

                goodEndingIndex++;

                showDialogue(
                    goodEndingDialogue[
                        goodEndingIndex
                    ]
                );

                safeCall(
                    window.playClickSound
                );

                return;
            }

            await finishGoodEnding();

        }

    }

    /* ============================================================
       OPEN LIFT
       ============================================================ */

    async function openLift() {

        hideDialogue();

        await wait(500);

        safeCall(
            window.setBackgroundLiftOpen
        );

        await wait(900);

        dialogueIndex = 0;

        phase =
            "strangePerson";

        showDialogue(
            strangePersonDialogue[0]
        );

    }

    /* ============================================================
       CHOICE
       ============================================================ */

    function showChoice() {

        hideDialogue();

        if (
            DOM &&
            DOM.choiceBox
        ) {

            DOM.choiceBox.classList.add(
                "active"
            );

        }

        if (
            DOM &&
            DOM.choiceTitle
        ) {

            DOM.choiceTitle.textContent =
                "QUE FAIRE ?";
        }

    }

    function hideChoice() {

        if (
            DOM &&
            DOM.choiceBox
        ) {

            DOM.choiceBox.classList.remove(
                "active"
            );

        }

    }

    /* ============================================================
       CHOICE 1
       BLOQUER LA PORTE
       ============================================================ */

    async function blockDoor() {

        if (busy || ended) {
            return;
        }

        busy = true;

        hideChoice();

        safeCall(
            window.playClickSound
        );

        /*
         * Nate devient heureux.
         */

        safeCall(
            window.setNate,
            ASSETS.nateHappy
        );

        safeCall(
            window.showNate
        );

        await wait(500);

        /*
         * Bonne route.
         */

        phase =
            "goodEnding";

        goodEndingIndex = 0;

        showDialogue(
            goodEndingDialogue[0]
        );

        busy = false;

    }

    /* ============================================================
       CHOICE 2
       LAISSER LA PORTE SE FERMER
       ============================================================ */

    async function letDoorClose() {

        if (busy || ended) {
            return;
        }

        busy = true;

        hideChoice();

        safeCall(
            window.playClickSound
        );

        await wait(600);

        await goToParty015();

        busy = false;

    }

    /* ============================================================
       FIN BONNE ROUTE
       ============================================================ */

    async function finishGoodEnding() {

        if (ended) {
            return;
        }

        ended = true;

        hideDialogue();

        await wait(900);

        /*
         * Pour l'instant on prépare la transition
         * vers PARTY [02].
         */

        await goToParty02();

    }

    /* ============================================================
       PARTY [01.5]
       ============================================================ */

    async function goToParty015() {

        if (ended) {
            return;
        }

        ended = true;

        PARTY.current =
            "1.5";

        if (
            DOM &&
            DOM.fade
        ) {

            DOM.fade.classList.add(
                "active"
            );

        }

        await wait(650);

        try {

            await window.loadPartyScript(
                "1.5"
            );

            hideDialogue();

            hideChoice();

            if (
                typeof window.party015_Start ===
                "function"
            ) {

                window.party015_Start();

            } else {

                console.warn(
                    "[PARTY 01] party015_Start() introuvable."
                );

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Impossible de charger PARTY [01.5]",
                error
            );

            /*
             * Si [01.5] n'existe pas encore,
             * on revient à PARTY [01].
             */

            PARTY.current =
                1;

            ended = false;

            if (
                DOM &&
                DOM.fade
            ) {

                DOM.fade.classList.remove(
                    "active"
                );

            }

        }

    }

    /* ============================================================
       PARTY [02]
       ============================================================ */

    async function goToParty02() {

        PARTY.current =
            2;

        if (
            DOM &&
            DOM.fade
        ) {

            DOM.fade.classList.add(
                "active"
            );

        }

        await wait(650);

        try {

            await window.loadPartyScript(
                2
            );

            hideDialogue();

            hideChoice();

            if (
                typeof window.party02_Start ===
                "function"
            ) {

                window.party02_Start();

            } else {

                console.warn(
                    "[PARTY 01] party02_Start() introuvable."
                );

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Impossible de charger PARTY [02]",
                error
            );

            /*
             * PARTY [02] n'existe pas encore.
             * On enlève simplement le fondu pour
             * éviter de bloquer complètement l'écran.
             */

            PARTY.current =
                1;

            if (
                DOM &&
                DOM.fade
            ) {

                DOM.fade.classList.remove(
                    "active"
                );

            }

        }

    }

    /* ============================================================
       CHOICE BUTTON CONNECTION
       ============================================================ */

    function connectChoiceButtons() {

        if (choicesConnected) {
            return;
        }

        if (
            !DOM ||
            !DOM.choice1 ||
            !DOM.choice2
        ) {

            console.error(
                "[PARTY 01] Boutons de choix introuvables."
            );

            return;
        }

        DOM.choice1.onclick =
            () => {

                blockDoor();

            };

        DOM.choice2.onclick =
            () => {

                letDoorClose();

            };

        DOM.choice1.onmouseenter =
            () => {

                safeCall(
                    window.playHoverSound
                );

            };

        DOM.choice2.onmouseenter =
            () => {

                safeCall(
                    window.playHoverSound
                );

            };

        choicesConnected =
            true;

    }

    /* ============================================================
       DIALOGUE CLICK
       ============================================================ */

    function connectDialogue() {

        if (dialogueConnected) {
            return;
        }

        if (
            !DOM ||
            !DOM.dialogueBox
        ) {

            return;
        }

        DOM.dialogueBox.onclick =
            () => {

                nextDialogue();

            };

        dialogueConnected =
            true;

    }

    /* ============================================================
       PARTY START
       ============================================================ */

    window.party01_Start =
        function() {

            console.log(
                "[PARTY 01] START"
            );

            /*
             * Reset state.
             */

            dialogueIndex = 0;
            goodEndingIndex = 0;

            phase =
                "intro";

            ended = false;
            busy = false;

            /*
             * PARTY state.
             */

            PARTY.current =
                1;

            PARTY.started =
                true;

            /*
             * Interface.
             */

            if (
                DOM &&
                DOM.party01
            ) {

                DOM.party01.classList.add(
                    "active"
                );

            }

            hideChoice();

            /*
             * Ascenseur fermé.
             */

            safeCall(
                window.setBackgroundLift
            );

            /*
             * Nate n'est pas visible pendant
             * la scène d'ascenseur.
             */

            safeCall(
                window.hideNate
            );

            /*
             * Musique.
             */

            safeCall(
                window.startIntroMusic
            );

            /*
             * Boutons.
             */

            connectChoiceButtons();

            connectDialogue();

            /*
             * Premier dialogue.
             */

            showDialogue(
                introDialogue[0]
            );

            /*
             * Sécurité : enlever le fade
             * si le loader l'a laissé actif.
             */

            setTimeout(() => {

                if (
                    DOM &&
                    DOM.fade
                ) {

                    DOM.fade.classList.remove(
                        "active"
                    );

                }

            }, 100);

        };

    /* ============================================================
       EXTERNAL API
       ============================================================ */

    window.party01_NextDialogue =
        nextDialogue;

    window.party01_BlockDoor =
        blockDoor;

    window.party01_LetDoorClose =
        letDoorClose;

    window.party01_GoToParty015 =
        goToParty015;

    window.party01_GoToParty02 =
        goToParty02;

    window.party01_ShowChoice =
        showChoice;

    /* ============================================================
       LOADED
       ============================================================ */

    console.log(
        "[PARTY 01] party[01].js chargé."
    );

})();
