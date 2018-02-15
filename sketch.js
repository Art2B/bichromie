const map_range = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
}
function shadeBlendConvert(p, from, to) {
    if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
    if(!this.sbcRip)this.sbcRip=(d)=>{
        let l=d.length,RGB=new Object();
        if(l>9){
            d=d.split(",");
            if(d.length<3||d.length>4)return null;//ErrorCheck
            RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
        }else{
            if(l==8||l==6||l<4)return null; //ErrorCheck
            if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
            d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
        }
        return RGB;}
    var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
    if(!f||!t)return null; //ErrorCheck
    if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
    else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
}

const exportImg = (link, canvas) => {
  link.href = canvas.toDataURL()
  link.download = 'awesome_profil_picture.png'
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const img = new Image()
// Brightness input & value
const brightnessInput = document.getElementById('brightness')
let brightness = brightnessInput.value
// Contrast input & value
const contrastInput = document.getElementById('contrast')
let contrast = contrastInput.value
// Invert input & value
const invertInput = document.getElementById('invert')
let invert = invertInput.value
// Saturate input & value
const saturateInput = document.getElementById('saturate')
let saturate = saturateInput.value
// Sepia input & value
const sepiaInput = document.getElementById('sepia')
let sepia = sepiaInput.value
// Color input & value
const colorInput = document.getElementById('color')
let color = colorInput.value
// Export input
const exportBtn = document.getElementById('export')

// Brightness & Color input event change
brightnessInput.onchange = e => {
  brightness = e.target.value
  drawImage(img, color)
}
contrastInput.onchange = e => {
  contrast = e.target.value
  drawImage(img, color)
}
invertInput.onchange = e => {
  invert = e.target.value
  drawImage(img, color)
}
saturateInput.onchange = e => {
  saturate = e.target.value
  drawImage(img, color)
}
sepiaInput.onchange = e => {
  sepia = e.target.value
  drawImage(img, color)
}
colorInput.onchange = e => {
  color = e.target.value
  document.querySelector('body').style.background = color
  drawImage(img, color)
}
// Export image
exportBtn.onclick = e => exportImg(e.target, canvas)

// Drawing image
let drawImage = (img, hexColor) => {
  ctx.filter = 'brightness(' + brightness + '%) contrast(' + contrast + '%) invert(' + invert + '%) saturate(' + saturate + '%) sepia(' + sepia + '%) grayscale(100%)'
  ctx.drawImage(img, 0, 0)

  let imgData = ctx.getImageData(0, 0, img.width, img.height)

  for (let i = 0; i < imgData.data.length; i += 4) {
    const mono = (0.299 * imgData.data[i] + 0.587 * imgData.data[i + 1] + 0.114 * imgData.data[i + 2])
    const darkPercent = map_range(mono, 0, 255, -1, 0)
    const pixelColor = shadeBlendConvert(darkPercent, hexColor, 'c').replace('rgb(', '').replace(')', '').split(',')

    imgData.data[i] = pixelColor[0]
    imgData.data[i + 1] = pixelColor[1]
    imgData.data[i + 2] = pixelColor[2]
  }

  ctx.putImageData(imgData, 0, 0)
}

// Load image
img.onload = () => {
  drawImage(img, color)
}
img.src = 'assets/yolo.png'