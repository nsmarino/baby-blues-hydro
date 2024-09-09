/* eslint-disable prettier/prettier */
function WillBounce({text}) {

const mapped = () => Array.from(text).map(char => char===" " ? <span key={char}>&nbsp;</span> : <span key={char}>{char}</span>);
  return (
    <>
    {mapped()}
    </>
  );
}
export default WillBounce;