import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
const results=[]
const browser=await chromium.launch({channel:'msedge'})
try {
 for(const mobile of [false,true]) {
  const name=mobile?'mobile':'desktop',viewport=mobile?{width:390,height:844}:{width:1440,height:900}
  const page=await browser.newPage({viewport,isMobile:mobile,hasTouch:mobile,reducedMotion:mobile?'reduce':'no-preference'})
  page.setDefaultTimeout(60000)
  const errors=[]
  page.on('pageerror',e=>{errors.push(e.message);console.log(name,'ERROR',e.message)})
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
  console.log(name,'opening')
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'})
  await page.getByTestId('model-casa-1').click();await page.getByTestId('open-3d').click()
  const scene=page.getByTestId('pilot-three-scene')
  await page.waitForFunction(()=>document.querySelector('[data-testid=pilot-three-scene]')?.dataset.progress==='100',null,{timeout:90000})
  assert.equal(await scene.getAttribute('data-renderer'),'webgl')
  assert.equal(await scene.locator('canvas').count(),1)
  assert.equal(await scene.getAttribute('data-furniture'),'19')
  assert.equal(await scene.getAttribute('data-roof'),'open')
  console.log(name,'model ready: 19 furniture groups')
  for(let i=0;i<3;i++)await page.getByTestId('guide-next').click()
  const x=viewport.width*.54,y=viewport.height*.45
  assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName,{x,y}),'CANVAS')
  const angle=Number(await scene.getAttribute('data-azimuth'))
  const beforeFrame=Number(await scene.getAttribute('data-frames'))
  if(mobile){
   const cdp=await page.context().newCDPSession(page)
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]})
   for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+i*10,y,id:0}]})
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
   const distance=Number(await scene.getAttribute('data-distance'))
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-25,y,id:0},{x:x+25,y,id:1}]})
   for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-25-i*8,y,id:0},{x:x+25+i*8,y,id:1}]})
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
   assert.ok(Number(await scene.getAttribute('data-distance'))<distance,'Pinch must zoom in')
   await cdp.detach()
  }else{
   await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+140,y-30,{steps:8});await page.mouse.up()
   const distance=Number(await scene.getAttribute('data-distance'))
   await page.mouse.wheel(0,-400)
   await page.waitForTimeout(300)
   assert.ok(Number(await scene.getAttribute('data-distance'))<distance,'Wheel must zoom in')
  }
  assert.ok(Math.abs(Number(await scene.getAttribute('data-azimuth'))-angle)>.05,'Drag must rotate')
  assert.ok(Number(await scene.getAttribute('data-frames'))>beforeFrame,'Gesture must produce rendered frames')
  console.log(name,'real drag and zoom passed')
  await page.getByRole('button',{name:'Restaurar vista',exact:true}).click()
  await page.screenshot({path:`evidence/recording-${name}-furnished.png`})
  await page.getByTestId('roof-toggle').click()
  assert.equal(await scene.getAttribute('data-roof'),'closed')
  await page.getByRole('button',{name:'Sala e cozinha',exact:true}).click()
  assert.equal(await scene.getAttribute('data-roof'),'auto-open')
  await page.screenshot({path:`evidence/recording-${name}-living.png`})
  for(const room of ['Suíte','Banheiros','Banheiro da suíte']){
   await page.getByRole('button',{name:room,exact:true}).click()
   await page.screenshot({path:`evidence/recording-${name}-${room==='Suíte'?'bedroom':room==='Banheiros'?'bathroom':'suite-bathroom'}.png`})
  }
  await page.getByRole('button',{name:'Restaurar vista',exact:true}).click()
  assert.equal(await scene.getAttribute('data-roof'),'closed')
  await page.getByTestId('roof-toggle').click()
  for(const p of [0,35,70,100]){
   await page.getByTestId('construction-progress').fill(String(p))
   assert.equal(await scene.getAttribute('data-progress'),String(p))
   if(p===0)assert.equal(await scene.getAttribute('data-furniture'),'0')
  }
  assert.equal(await scene.getAttribute('data-furniture'),'19')
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  if(mobile){
   await scene.locator('canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
   await page.getByRole('button',{name:'Tentar carregar o modelo 3D'}).waitFor()
   assert.equal(await scene.getAttribute('data-renderer'),'unavailable')
   await page.getByRole('button',{name:'Tentar carregar o modelo 3D'}).click()
   await page.waitForFunction(()=>document.querySelector('[data-testid=pilot-three-scene]')?.dataset.renderer==='webgl',null,{timeout:90000})
   assert.equal(await scene.getAttribute('data-furniture'),'19')
   assert.equal(await scene.locator('canvas').count(),1)
   console.log(name,'WebGL recovery passed')
  }
  assert.deepEqual(errors,[])
  console.log(name,'roof, rooms, reverse construction, console passed')
  results.push({name,renderer:'webgl',furniture:19,drag:true,zoom:true,rooms:true,roof:true,reverse:true,errors})
  await page.close()
 }
 await writeFile('evidence/recording-validation.json',JSON.stringify({date:new Date().toISOString(),results},null,2))
}finally{await browser.close()}
