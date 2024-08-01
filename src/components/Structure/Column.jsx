

const Column = ({className="", ...props}) => {
  return (
    <div 
        className={"flex flex-col " + className}
    >
        {props.children}
    </div>
    )
}


export default Column;