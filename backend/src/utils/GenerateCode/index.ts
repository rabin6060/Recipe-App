export const generateCode = (length:number) =>{
    let code = ''
    for (let i = 0; i < length; i++) {
        const num = Math.floor(Math.random()*10)
        code+=num
    }
    return code
}

