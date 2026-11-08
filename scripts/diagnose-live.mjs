import { chromium } from 'playwright'
const browser=await chromium.launch({channel:'msedge'})
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}})
 page.setDefaultTimeout(45000)
 page.on('pageerror',e=>console.log('PAGE ERROR',e.message))
 page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text())})
 console.log('Opening')
 await page.goto('http://127.0.0.1:5173')
 console.log('Selecting')
 await page.getByTestId('model-casa-1').click()
 console.log('Waiting model')
 await page.waitForTimeout(7000)
 console.log(await page.locator('[data-testid=pilot-three-scene]').evaluate(e=>({dataset:{...e.dataset},canvas:e.querySelectorAll('canvas').length,text:e.innerText,box:e.getBoundingClientRect().toJSON()})))
 await page.screenshot({path:'evidence/diagnose-current.png',timeout:20000})
 const p={x:700,y:400}
 console.log('Pointer target',await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.outerHTML.slice(0,250),p))
 await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(850,440,{steps:5});await page.mouse.up()
 await page.mouse.wheel(0,-300)
 console.log('After gesture',await page.locator('[data-testid=pilot-three-scene]').evaluate(e=>({...e.dataset})))
}finally{await browser.close()}
