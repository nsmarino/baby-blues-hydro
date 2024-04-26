function HashBorder({children, top,}) {
    return (
      <div>
        {top && <span className="hash-top"></span>}
        {children}    
      </div>
    )
  }

export default HashBorder