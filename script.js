console.log("Tushar is a hacker")
console.log("gANESH is a hecker")

setTimeout(()=>{
    console.log("Hey i am a timeout")
},0)
setTimeout(()=>{
    console.log("Hey i am a timeout 2")
},0)


console.log("The End")
const callback = (arg) =>{
    console.log(arg)
}
const loadScript=(src,callback) => {
    let sc = document.createElement("script")
    sc.src = src;
    sc.onload = callback("Tushar");
    document.head.append(sc)
}

loadScript("https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js", callback )