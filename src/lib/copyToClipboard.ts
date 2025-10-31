
  export const copyToClipboard = (hasPlayedToday: boolean, prevOutcome: boolean | undefined, lives: number, didWin: boolean) => {
    const pad = (val: number) => {
      const valString = `${val}`;
      return valString.length < 2 ? `0${valString}` : valString;
    };
    const hearts = hasPlayedToday
      ? prevOutcome
        ? '❤️'.repeat(Number(localStorage.prevLives))
        : '🖤'
      : didWin
        ? '❤️'.repeat(lives)
        : '🖤';
    const prefaceText = '⏱';
    const gameTime = 0;
    const copyText = `Picodia #fart    ${hearts}    ${prefaceText}${pad(
      parseInt(String(gameTime / 60), 10)
    )}:${pad(Number(gameTime % 60))}`;
    navigator.clipboard.writeText(copyText);
    // alert(copyText);
    // setAlert(true);
    // setTimeout(() => {
    //   setAlert(false);
    // }, 4000);
  };