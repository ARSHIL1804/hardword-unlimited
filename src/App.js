import React, { useState, useEffect } from 'react';
import { shuffle, sample, forEach } from 'lodash'
import StatsPopup from './StatsPopup';
const defaultGameData = {
  solution: "",
  attempts: [["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""], ["", "", "", ""]],
  attemptsScores: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
  currentAttmptIndex: 0,
  currentAttmptCharIndex: 0,
  isGameOver: false
};


const App = () => {

  const WORD_LIST = JSON.parse('["able","acid","aide","aids","also","army","auto","back","bake","band","bank","base","bean","bear","beat","belt","bend","best","bike","bind","bird","bite","blow","blue","boat","body","bond","bone","born","both","bowl","buck","burn","bury","busy","cake","camp","card","care","case","cash","cast","chef","chip","cite","city","club","clue","coal","coat","code","cold","come","cope","copy","core","corn","cost","crew","crop","dare","dark","date","deal","dear","debt","deck","deny","desk","diet","dirt","dish","down","drag","draw","drop","drug","dust","duty","each","earn","east","easy","face","fact","fade","fail","fair","farm","fast","fate","fear","file","film","find","fine","fire","firm","fish","five","flag","flat","flow","folk","form","four","from","fuel","fund","gain","game","gate","gaze","gear","gift","girl","give","glad","goal","gold","golf","grab","gray","grow","hair","half","hand","hang","hard","hate","have","head","hear","heat","help","hero","hide","hire","hold","hole","holy","home","hope","host","hour","huge","hurt","idea","into","iron","item","jail","join","joke","jump","jury","just","kind","king","know","lack","lady","lake","land","last","late","lawn","lead","leaf","lean","left","life","lift","like","line","link","list","live","load","loan","lock","long","lose","lost","lots","loud","love","luck","lung","mail","main","make","male","many","mark","mask","math","meal","mean","meat","menu","milk","mind","mine","mode","more","most","move","much","must","myth","name","near","neck","news","next","nice","nose","note","okay","once","only","open","oven","over","pace","pack","page","pain","pair","pale","palm","pant","park","part","past","path","peak","pick","pile","pine","pink","plan","play","plot","plus","poem","poet","pole","port","pose","post","pour","pray","pure","push","quit","race","rail","rain","rank","rate","read","real","rely","rest","rice","rich","ride","ring","rise","risk","road","rock","role","rope","rose","rule","rush","safe","sake","sale","salt","same","sand","save","seat","self","send","ship","shit","shoe","shop","shot","show","shut","sick","side","sigh","sign","sing","sink","site","size","skin","slip","slow","snap","snow","soft","soil","some","song","sort","soul","soup","spin","spot","star","stay","step","stir","stop","such","suit","sure","swim","tail","take","tale","talk","tank","tape","task","team","tear","tend","term","than","them","then","they","thin","this","thus","time","tiny","tire","tone","tour","town","trip","true","tube","turn","twin","type","ugly","unit","upon","urge","used","user","vary","vast","very","view","vote","wage","wait","wake","walk","want","warm","warn","wash","wave","weak","wear","west","what","when","whom","wide","wife","wild","wind","wine","wing","wipe","wire","wise","wish","with","word","work","wrap","yard","yeah","year","your","zone"]')
  const TOTAL_ALLOWED_GUESS = 8;

  const [gameData, setGameData] = useState(defaultGameData);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);



  const showAlertMessgae = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(()=>{
      setAlertMessage('');
      setShowAlert(false);
      setIsStatsOpen(true)
    },[5000]);
  }


  const initializeGame = () => {
    const isResumeGame = localStorage.getItem('resume-game');
    if(isResumeGame){
      resumeExistingGame();
    }
    else{
      setupNewGame();
    }
  }

  const setupNewGame = () => {
    const resumeGame = 0;
    const previousAnswers = [];
    const filteredList = WORD_LIST.filter((value, index) => {
      return !previousAnswers.includes(value);
    })

    const shuffledFilteredList = shuffle(filteredList);
    const gameAnswer = sample(shuffledFilteredList);
    console.log(gameAnswer);
    setGameData({
      ...defaultGameData,
      solution: gameAnswer.toUpperCase()
    });
  }

  

  const resumeExistingGame = () => {
    const resumeGame = localStorage.getItem('game-data');
    setupNewGame(resumeGame);
  }

  const resetGame = () => {

  }

  const calculateScore = (prevGameData) => {
    const currentGuess = prevGameData.attempts[prevGameData.currentAttmptIndex].join('');
    const targetWord = prevGameData.solution;
    let exactMatches = 0 , partialMatches = 0;
    for(let i=0;i<4;i++){
      const targetIndex = targetWord.indexOf(currentGuess[i]);
      if(targetIndex == -1)continue;
      if(targetIndex == i){
        exactMatches++;
      }
      else{
        partialMatches++;
      }
    }
    return {
      exactMatches,
      partialMatches
    }
  }

  const handleKeyBoardEvents = (event) => {
    event.preventDefault();
    let key;
    var charCode = event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)){
      key = event.key.toUpperCase();
    }
    else if(event.key === 'Enter'){
      key ='OK';
    }
    else if(event.key === 'Backspace'){
      key = '⌫';
    }
    else{
      return;
    }
    handleKeyPress(key)
  }

  
  const handleKeyPress = (key) => {
    if (gameData.isGameOver) return;

    setGameData(prevGameData => {
      const currentGameData = { ...prevGameData };
      const currentGuess = currentGameData.attempts[currentGameData.currentAttmptIndex].join('');

      if (key === 'OK') {
        if (currentGuess.length !== 4) {
          setShowAlert(true)
          showAlertMessgae('Word must be 4 letters long');
          return currentGameData;
        }

        if (!WORD_LIST.includes(currentGuess.toLowerCase())) {
          setShowAlert(true)
          showAlertMessgae('Word not in the list');
          return currentGameData;
        }

        const { exactMatches, partialMatches } = calculateScore(prevGameData);
        currentGameData.attemptsScores[currentGameData.currentAttmptIndex] = [exactMatches, partialMatches];

        if (exactMatches === 4) {
          currentGameData.isGameOver = true;
          setShowAlert(true)
          showAlertMessgae('Congratulations! You won!');
        } else if (currentGameData.currentAttmptIndex === TOTAL_ALLOWED_GUESS - 1) {
          currentGameData.isGameOver = true;
          setShowAlert(true)
          showAlertMessgae(`Game Over! The word was ${currentGameData.solution}`);
        }
        currentGameData.currentAttmptIndex++;
        currentGameData.currentAttmptCharIndex = 0;
        
      } else if (key === '⌫') {
        if (currentGameData.currentAttmptCharIndex > 0) {
          const newAttempts = [...currentGameData.attempts];
          newAttempts[currentGameData.currentAttmptIndex][currentGameData.currentAttmptCharIndex - 1] = '';
          currentGameData.attempts = newAttempts;
          currentGameData.currentAttmptCharIndex--;
        }
      } else if (currentGuess.length < 4) {
        const newAttempts = [...currentGameData.attempts];
        newAttempts[currentGameData.currentAttmptIndex][currentGameData.currentAttmptCharIndex] = key;
        currentGameData.attempts = newAttempts;
        currentGameData.currentAttmptCharIndex++;
      }

      return currentGameData;
    });
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['OK', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  const closePopup = () => {

  }

  useEffect(() => {
    initializeGame();
    window.addEventListener('keyup',handleKeyBoardEvents);
    return () => window.removeEventListener('keyup', handleKeyBoardEvents);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 relative">
      {
        showAlert && 
        <div className='bg-white p-4 absolute w-fit ml-auto mr-auto left-0 right-0 top-[10%] text-black text-sm  font-semibold'>
            {alertMessage}
        </div>
      }
      <h1 className="text-2xl font-bold text-center mb-4">Hard Word Unlimited</h1>

      <div className="flex justify-center items-center flex-col  space-y-2">
        {
          gameData.attempts.map((attempt, attemptIndex) =>
            <div className='flex justify-center items-center gap-4'>
              <div key={attemptIndex} className="flex items-center space-x-4">
                <div className="grid grid-cols-4 gap-1">
                  {
                    attempt.map((char, charIndex) => {
                      return (
                        <div key={charIndex} className="w-10 h-10 border flex items-center justify-center text-lg font-bold bg-gray-800">
                          {char}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='flex justify-center items-center'>
                {
                  attemptIndex < gameData.currentAttmptIndex &&
                    <div className="flex  justify-center items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-text-color-1 ${gameData.attemptsScores[attemptIndex][0] == 0 ? 'bg-[#333]' : 'bg-green-500 text-text-color-2'}`}>
                          {gameData.attemptsScores[attemptIndex][0]}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-text-color-1 ${gameData.attemptsScores[attemptIndex][1] == 0 ? 'bg-[#333]' : 'bg-yellow-500 text-text-color-2'} `} >
                        {gameData.attemptsScores[attemptIndex][1]}
                      </div>
                    </div>
                }
                {
                  attemptIndex > gameData.currentAttmptIndex &&
                    (<div className="flex  justify-center items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white `}>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white">
                      </div>
                    </div>) 
                }
                {
                  attemptIndex === gameData.currentAttmptIndex &&
                    <div className="flex  justify-center items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#584e06] border-green-500 border-2`}>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#584e06] border-yellow-500 border-2`} >
                      </div>
                    </div>
                }

              </div>

            </div>
          )
        }
      </div>

      <div className="mt-2 space-y-2 bg-keyboard-bg p-4 w-[100%] max-w-[500px]">
        {keyboard.map((row, i) => (
          <div key={i} className="flex justify-center gap-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="w-10 h-10 gap-2 rounded  bg-key-bg  text-white font-semibold hover:bg-gray-600 flex items-center justify-center p-2 text-sm"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
      {
        isStatsOpen && <StatsPopup isOpen={isStatsOpen} close={()=>setIsStatsOpen(false)} newGame={setupNewGame} />
      }
    </div>
  );
};

export default App;