function AsteriskBorder({children, top, left, right, bottom, fullscreen}) {
    return (
      <div className={`${fullscreen ? "fullscreen" : ""}`}>
        {top && <span className="ast-top"></span>}
        {left && <span className="ast-left"></span>}
        {right && <span className="ast-right"></span>}
        {bottom && <span className="ast-bottom"></span>}
        {children}    
      </div>
    )
  }

export default AsteriskBorder