(() => {
    "use strict";

    /*
     * ============================================================
     * NATE HAND GESTURE
     * PARTY [01]
     * ============================================================
     *
     * STORY:
     *
     * Nate rentre chez lui.
     * L'ascenseur semble beaucoup plus long que d'habitude.
     *
     * Lorsqu'il arrive enfin à son étage, la porte s'ouvre.
     * Une étrange personne se trouve devant lui.
     *
     * La porte commence ensuite à se refermer.
     *
     * CHOIX :
     *
     * 1. BLOQUER LA PORTE
     *    -> GOOD ENDING
     *
     * 2. LAISSER LA PORTE SE FERMER
     *    -> BAD ENDING
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
    let endingIndex = 0;

    let phase = "intro";

    let ended = false;
    let busy = false;

    let choicesConnected = false;
    let dialogueConnected = false;

    /*
     * Typewriter
     */

    let typing = false;
    let typingTimer = null;

    let currentEntry = null;
    let currentDisplayedText = "";

    const TYPE_SPEED = 28;

    /* ============================================================
       UTILS
       ============================================================ */

    function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    function safeCall(fn, ...args) {

        try {

            if (typeof fn === "function") {
                return fn(...args);
            }

        } catch (error) {

            console.error(
                "[PARTY 01] Erreur :",
                error
            );

        }

    }

    function playClick() {

        safeCall(
            window.playClickSound
        );

    }

    function playHover() {

        safeCall(
            window.playHoverSound
        );

    }

    /* ============================================================
       INTRO
       ============================================================ */

    const introDialogue = [

        {
            type: "nate",
            name: "Nate",
            text:
                "Enfin... une journée de plus."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je pensais vraiment ne jamais réussir à terminer aujourd'hui."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "J'ai juste envie de rentrer chez moi, de fermer la porte et de dormir."
        },

        {
            type: "thought",
            text:
                "(Mes jambes sont complètement mortes...)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Allez... encore quelques étages."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je ne devrais même pas avoir à réfléchir autant pour prendre un ascenseur."
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "thought",
            text:
                "(Pourquoi est-ce que ça paraît aussi long ?)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je suis pourtant déjà monté dans cet ascenseur des centaines de fois."
        },

        {
            type: "thought",
            text:
                "(Quelque chose ne va pas.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Peut-être que je suis juste trop fatigué."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Oui... c'est sûrement ça."
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "thought",
            text:
                "(Pourquoi l'ascenseur ne ralentit toujours pas ?)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "J'espère qu'on va bientôt arriver."
        }

    ];

    /* ============================================================
       STRANGE PERSON
       ============================================================ */

    const strangePersonDialogue = [

        {
            type: "thought",
            text:
                "(Enfin.)"
        },

        {
            type: "thought",
            text:
                "(La porte s'ouvre.)"
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "thought",
            text:
                "(Attends.)"
        },

        {
            type: "thought",
            text:
                "(Il y a quelqu'un.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Euh..."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Bonsoir."
        },

        {
            type: "thought",
            text:
                "(Elle ne répond pas.)"
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
                "Vous venez d'emménager dans l'immeuble ?"
        },

        {
            type: "thought",
            text:
                "(Toujours rien.)"
        },

        {
            type: "thought",
            text:
                "(Elle me regarde.)"
        },

        {
            type: "thought",
            text:
                "(Non... elle ne me regarde pas vraiment.)"
        },

        {
            type: "thought",
            text:
                "(Ses yeux...)"
        },

        {
            type: "thought",
            text:
                "(Pourquoi est-ce que je n'arrive pas à voir son visage ?)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Vous allez au même étage que moi ?"
        },

        {
            type: "thought",
            text:
                "(Elle avance.)"
        },

        {
            type: "thought",
            text:
                "(Un pas.)"
        },

        {
            type: "thought",
            text:
                "(Puis un autre.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Euh... vous voulez entrer ?"
        },

        {
            type: "thought",
            text:
                "(La porte commence à se fermer.)"
        },

        {
            type: "thought",
            text:
                "(Je dois faire quelque chose.)"
        }

    ];

    /* ============================================================
       GOOD ENDING
       ============================================================ */

    const goodEndingDialogue = [

        {
            type: "nate",
            name: "Nate",
            text:
                "Attendez !"
        },

        {
            type: "thought",
            text:
                "(Je tends rapidement la main vers le bouton.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je vais maintenir la porte."
        },

        {
            type: "thought",
            text:
                "(La porte s'arrête.)"
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "thought",
            text:
                "(Elle entre.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Voilà..."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "C'est bon."
        },

        {
            type: "thought",
            text:
                "(Elle reste silencieuse.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Je sais que c'est un peu bizarre de demander ça..."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Mais je ne vous ai vraiment jamais vue dans cet immeuble."
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Vous habitez ici depuis longtemps ?"
        },

        {
            type: "thought",
            text:
                "(Elle tourne lentement la tête vers moi.)"
        },

        {
            type: "thought",
            text:
                "(Cette fois, je peux voir son visage.)"
        },

        {
            type: "thought",
            text:
                "(Enfin... je crois.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "..."
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
        },

        {
            type: "thought",
            text:
                "(Elle sourit.)"
        },

        {
            type: "thought",
            text:
                "(Je ne sais pas pourquoi...)"
        },

        {
            type: "thought",
            text:
                "(Mais je sens que j'ai fait le bon choix.)"
        }

    ];

    /* ============================================================
       BAD ENDING
       ============================================================ */

    const badEndingDialogue = [

        {
            type: "nate",
            name: "Nate",
            text:
                "..."
        },

        {
            type: "thought",
            text:
                "(Je ne vais pas attendre.)"
        },

        {
            type: "thought",
            text:
                "(La porte se ferme.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Désolé."
        },

        {
            type: "thought",
            text:
                "(Les portes se referment complètement.)"
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Enfin."
        },

        {
            type: "thought",
            text:
                "(Je peux enfin rentrer chez moi.)"
        },

        {
            type: "thought",
            text:
                "(L'ascenseur recommence à monter.)"
        },

        {
            type: "thought",
            text:
                "(...)"
        },

        {
            type: "thought",
            text:
                "(Attends.)"
        },

        {
            type: "thought",
            text:
                "(Pourquoi est-ce qu'il monte encore ?)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "..."
        },

        {
            type: "thought",
            text:
                "(Mon étage est déjà passé.)"
        },

        {
            type: "thought",
            text:
                "(L'écran indique un étage que je ne connais pas.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Non..."
        },

        {
            type: "thought",
            text:
                "(La lumière de l'ascenseur commence à clignoter.)"
        },

        {
            type: "thought",
            text:
                "(Puis tout devient noir.)"
        },

        {
            type: "nate",
            name: "Nate",
            text:
                "Quelqu'un... ?"
        },

        {
            type: "thought",
            text:
                "(Je peux entendre quelqu'un respirer.)"
        },

        {
            type: "thought",
            text:
                "(Mais je suis seul.)"
        },

        {
            type: "thought",
            text:
                "(Enfin...)"
        },

        {
            type: "thought",
            text:
                "(Je pensais être seul.)"
        }

    ];

    /* ============================================================
       TYPEWRITER
       ============================================================ */

    function clearTypingTimer() {

        if (typingTimer !== null) {

            clearTimeout(
                typingTimer
            );

            typingTimer = null;

        }

    }

    function finishCurrentText() {

        clearTypingTimer();

        typing = false;

        if (
            DOM &&
            DOM.dialogueText &&
            currentEntry
        ) {

            DOM.dialogueText.textContent =
                currentEntry.text || "";

        }

        currentDisplayedText =
            currentEntry
                ? currentEntry.text || ""
                : "";

    }

    function typeText(entry) {

        clearTypingTimer();

        currentEntry =
            entry;

        currentDisplayedText =
            "";

        typing =
            true;

        if (
            DOM &&
            DOM.dialogueText
        ) {

            DOM.dialogueText.textContent =
                "";

        }

        const text =
            entry.text || "";

        let position = 0;

        function writeCharacter() {

            if (!typing) {
                return;
            }

            if (position >= text.length) {

                typing =
                    false;

                typingTimer =
                    null;

                currentDisplayedText =
                    text;

                return;

            }

            currentDisplayedText +=
                text[position];

            if (
                DOM &&
                DOM.dialogueText
            ) {

                DOM.dialogueText.textContent =
                    currentDisplayedText;

            }

            position++;

            /*
             * Le son de sélection n'est pas joué
             * à chaque lettre afin de ne pas rendre
             * le dialogue agressif.
             */

            typingTimer =
                setTimeout(
                    writeCharacter,
                    TYPE_SPEED
                );

        }

        writeCharacter();

    }

    /* ============================================================
       SHOW DIALOGUE
       ============================================================ */

    function showDialogue(entry) {

        if (!entry) {
            return;
        }

        currentEntry =
            entry;

        if (
            !DOM ||
            !DOM.dialogueBox
        ) {

            return;
        }

        if (DOM.dialogueName) {

            DOM.dialogueName.textContent =
                entry.name || "";

        }

        if (DOM.dialogueText) {

            DOM.dialogueText.style.fontStyle =
                entry.type === "thought"
                    ? "italic"
                    : "normal";

            DOM.dialogueText.style.opacity =
                entry.type === "thought"
                    ? "0.82"
                    : "1";

        }

        DOM.dialogueBox.classList.remove(
            "hidden"
        );

        typeText(entry);

    }

    /* ============================================================
       HIDE DIALOGUE
       ============================================================ */

    function hideDialogue() {

        clearTypingTimer();

        typing =
            false;

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

        if (ended || busy) {
            return;
        }

        /*
         * Si le texte est encore en train de
         * s'afficher, le clic termine simplement
         * le texte.
         */

        if (typing) {

            finishCurrentText();

            playClick();

            return;

        }

        playClick();

        /* ========================================================
           INTRO
           ======================================================== */

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

                return;
            }

            /*
             * Fin de l'introduction.
             */

            busy = true;

            await openLift();

            busy = false;

            return;

        }

        /* ========================================================
           STRANGE PERSON
           ======================================================== */

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

                return;

            }

            /*
             * Le dialogue est terminé.
             * Afficher le choix.
             */

            showChoice();

            return;

        }

        /* ========================================================
           GOOD ENDING
           ======================================================== */

        if (phase === "goodEnding") {

            if (
                endingIndex <
                goodEndingDialogue.length - 1
            ) {

                endingIndex++;

                showDialogue(
                    goodEndingDialogue[
                        endingIndex
                    ]
                );

                return;

            }

            await finishGoodEnding();

            return;

        }

        /* ========================================================
           BAD ENDING
           ======================================================== */

        if (phase === "badEnding") {

            if (
                endingIndex <
                badEndingDialogue.length - 1
            ) {

                endingIndex++;

                showDialogue(
                    badEndingDialogue[
                        endingIndex
                    ]
                );

                return;

            }

            await finishBadEnding();

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

        dialogueIndex =
            0;

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

        if (
            DOM &&
            DOM.choice1
        ) {

            DOM.choice1.textContent =
                "Bloquer la porte";

        }

        if (
            DOM &&
            DOM.choice2
        ) {

            DOM.choice2.textContent =
                "Laisser la porte se fermer";

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
       GOOD ENDING
       ============================================================ */

    async function blockDoor() {

        if (busy || ended) {
            return;
        }

        busy =
            true;

        playClick();

        hideChoice();

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

        phase =
            "goodEnding";

        endingIndex =
            0;

        showDialogue(
            goodEndingDialogue[0]
        );

        busy =
            false;

    }

    /* ============================================================
       BAD ENDING
       ============================================================ */

    async function letDoorClose() {

        if (busy || ended) {
            return;
        }

        busy =
            true;

        playClick();

        hideChoice();

        /*
         * Retour au sprite normal.
         */

        safeCall(
            window.setNate,
            ASSETS.nateNormal
        );

        await wait(650);

        phase =
            "badEnding";

        endingIndex =
            0;

        showDialogue(
            badEndingDialogue[0]
        );

        busy =
            false;

    }

    /* ============================================================
       GOOD ENDING FINISH
       ============================================================ */

    async function finishGoodEnding() {

        if (ended) {
            return;
        }

        ended =
            true;

        hideDialogue();

        await wait(1000);

        /*
         * PARTY [02]
         */

        await goToParty02();

    }

    /* ============================================================
       BAD ENDING FINISH
       ============================================================ */

    async function finishBadEnding() {

        if (ended) {
            return;
        }

        ended =
            true;

        hideDialogue();

        await wait(1000);

        /*
         * Pour le moment la mauvaise fin utilise
         * PARTY [01.5].
         *
         * C'est cette PARTY qui pourra afficher
         * l'écran BAD ENDING définitif.
         */

        await goToParty015();

    }

    /* ============================================================
       PARTY [01.5]
       ============================================================ */

    async function goToParty015() {

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

        await wait(700);

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
                    "[PARTY 01] PARTY [01.5] n'est pas encore disponible."
                );

                /*
                 * Si PARTY [01.5] n'existe pas encore,
                 * on enlève le fade pour ne pas bloquer
                 * le joueur.
                 */

                PARTY.current =
                    1;

                ended =
                    false;

                if (
                    DOM &&
                    DOM.fade
                ) {

                    DOM.fade.classList.remove(
                        "active"
                    );

                }

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Erreur PARTY [01.5] :",
                error
            );

            PARTY.current =
                1;

            ended =
                false;

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

        await wait(700);

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
                    "[PARTY 01] PARTY [02] n'est pas encore disponible."
                );

                PARTY.current =
                    1;

                ended =
                    false;

                if (
                    DOM &&
                    DOM.fade
                ) {

                    DOM.fade.classList.remove(
                        "active"
                    );

                }

            }

        } catch (error) {

            console.error(
                "[PARTY 01] Erreur PARTY [02] :",
                error
            );

            PARTY.current =
                1;

            ended =
                false;

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
       CHOICE BUTTONS
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

                playHover();

            };

        DOM.choice2.onmouseenter =
            () => {

                playHover();

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

            console.error(
                "[PARTY 01] Dialogue introuvable."
            );

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
       START
       ============================================================ */

    window.party01_Start =
        function() {

            console.log(
                "[PARTY 01] START"
            );

            /*
             * RESET
             */

            dialogueIndex =
                0;

            endingIndex =
                0;

            phase =
                "intro";

            ended =
                false;

            busy =
                false;

            typing =
                false;

            currentEntry =
                null;

            currentDisplayedText =
                "";

            clearTypingTimer();

            /*
             * PARTY
             */

            PARTY.current =
                1;

            PARTY.started =
                true;

            /*
             * INTERFACE
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
             * Nate caché pendant la scène.
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
             * Connexions.
             */

            connectDialogue();
            connectChoiceButtons();

            /*
             * Premier dialogue.
             */

            showDialogue(
                introDialogue[0]
            );

            /*
             * Retirer le fade.
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
       PUBLIC API
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
