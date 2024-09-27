/* eslint-disable prettier/prettier */
function WillBounce({text}) {

const mapped = () => Array.from(text).map((char,i) => char===" " ? <span key={text+char+i}>&nbsp;</span> : <span key={char+text+i}>{char}</span>);
  return (
    <>
    {mapped()}
    </>
  );
}
export default WillBounce;