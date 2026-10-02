'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUp, Menu, Package, X } from 'lucide-react'

const INSTAGRAM = 'https://www.instagram.com/setuju.co/'
const SERVICES_DECK = 'https://bit.ly/SetujuServices'

// Unsplash photos — swap the ids for Setuju's own photography when ready.
const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`
const srcSet = (id) => [640, 1080, 1600, 2200].map(w => `${img(id, w)} ${w}w`).join(', ')

const photos = {
  hero: ['1613424777445-f93a2a48e285', 'Dried flowers in a clay vase casting soft afternoon shadows'],
  studio: ['1565791380713-1756b9a05343', 'Sunlit creative studio with a wooden work table'],
  product: ['1748543668751-902d6461890d', 'Skincare textures arranged with green leaves on a beige surface'],
  dessert: ['1787898314268-afd422d85b86', 'Bowls of sweet soup and snacks styled on a wooden table'],
  founder: ['1608804375369-498a4b601e42', 'Hand writing notes on paper in warm light'],
  contact: ['1550623627-5494e1e93ed6', 'Two people working together over coffee and laptops']
}

const services = [
  ['01','Graphic Design','IG Ads Management','Influencer Outreach','1787074623811-821d34f55c8f','Packaging design with an olive leaf illustration'],
  ['02','Product Photography','Studio Photography','Brand Profile','1527011046414-4781f1f94f8c','Photo studio with softbox lights and potted plants'],
  ['03','Marketing Strategy','Business Development','Social Media Strategy','1620325867502-221cfb5faa5f','Planning session with sticky notes on paper'],
  ['04','Social Media Management','Collaboration Project','','1622532832487-b18b9c7f23d3','Hand holding a phone while browsing a social feed']
]

const work = [
  ['SHOESTETIC','Brand Profile','Shoe care','1681718631486-c2246ffce63e','Cleaning spray held next to a white sneaker','center 58%'],
  ['STRAPPIE','Social Media Management','Footwear','1613662632164-7f2b081a5b46','Brown leather sandals on a white surface','center'],
  ['5TO5','Social Media Management','Food & beverage','1730871082582-49e083b500a1','Cake and iced drink on a round white cafe table','center'],
  ['BEAJOVE','Social Media Management','Beauty','1718490953028-021d352b14fd','Row of amber skincare bottles','center']
]

const marquee = ['Branding','Content Strategy','Social Media Management','Product Photography','IG Ads','Influencer Outreach']

// Lucide v1 dropped brand icons; this mirrors its Instagram glyph so it matches the rest of the set.
function InstagramIcon({size=18, strokeWidth=1.5}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>
}

function Photo({id, alt, label, className='', sizes='100vw', pos='center', priority=false}) {
  return <div className={`ph ${className}`}>
    <img src={img(id)} srcSet={srcSet(id)} sizes={sizes} alt={alt} style={{objectPosition:pos}} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/>
    {label && <span className="ph-tag">{label}</span>}
  </div>
}

function Reveal({children, className=''}) {
  return <div className={`reveal ${className}`}>{children}</div>
}

export default function Page(){
  const [menu,setMenu]=useState(false)
  const [activeService,setActiveService]=useState(0)
  const [scrolled,setScrolled]=useState(false)
  const [current,setCurrent]=useState('')
  const [hidden,setHidden]=useState(false)
  const [hover,setHover]=useState(null)
  const [line,setLine]=useState({x:0,w:0,on:false})
  const labels=useRef({})
  const root=useRef(null)

  useEffect(()=>{
    const els=[...document.querySelectorAll('.reveal')]
    const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('is-in')), {threshold:.12})
    els.forEach(e=>io.observe(e))
    const spy=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&setCurrent(e.target.id)), {rootMargin:'-45% 0px -50% 0px'})
    document.querySelectorAll('main > section').forEach(s=>spy.observe(s))
    let lastY=window.scrollY
    const onScroll=()=>{
      const y=window.scrollY
      document.documentElement.style.setProperty('--scroll', `${Math.min(y,1200)}`)
      setScrolled(y>40)
      if(Math.abs(y-lastY)>6){setHidden(y>lastY&&y>480);lastY=y}
    }
    onScroll()
    window.addEventListener('scroll',onScroll,{passive:true})
    return()=>{io.disconnect();spy.disconnect();window.removeEventListener('scroll',onScroll)}
  },[])

  // Slide the underline to the hovered link, falling back to the section in view.
  useEffect(()=>{
    const place=()=>{
      const el=labels.current[hover||current]
      setLine(l=>el?{x:el.offsetLeft,w:el.offsetWidth,on:true}:{...l,on:false})
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize',place)
    return()=>window.removeEventListener('resize',place)
  },[hover,current])

  useEffect(()=>{
    document.documentElement.style.overflow=menu?'hidden':''
    const onKey=e=>e.key==='Escape'&&setMenu(false)
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[menu])

  const go=(id)=>{setMenu(false);document.documentElement.style.overflow='';document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
  const navItems=[['work','Work'],['services','Services'],['about','About'],['contact','Contact']]
  const s=services[activeService]

  return <main ref={root}>
    <header className={`nav${scrolled?' scrolled':''}${hidden&&!menu?' hidden':''}${menu?' menu-open':''}`}>
      <div className="nav-inner">
        <div className="brand-wrap">
          <button className="brand" onClick={()=>go('top')} aria-label="Setuju — back to top">SETUJU</button>
          <span className="brand-note">Social Media &amp;<br/>Branding Agency</span>
        </div>
        <nav className="nav-links" aria-label="Main" onMouseLeave={()=>setHover(null)}>
          {navItems.map(([id,label])=><button key={id} className={current===id?'current':''} aria-current={current===id?'true':undefined} onMouseEnter={()=>setHover(id)} onFocus={()=>setHover(id)} onBlur={()=>setHover(null)} onClick={()=>go(id)}><span ref={el=>{labels.current[id]=el}}>{label}</span></button>)}
          <i className="nav-line" style={{'--x':`${line.x}px`,'--w':`${line.w}px`,opacity:line.on?1:0}} aria-hidden="true"/>
        </nav>
        <div className="nav-actions">
          <a className="nav-ig" href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Setuju on Instagram"><InstagramIcon size={19}/></a>
          <button className="menu" onClick={()=>setMenu(!menu)} aria-label={menu?'Close menu':'Open menu'} aria-expanded={menu} aria-controls="menu-panel"><span>{menu?'Close':'Menu'}</span>{menu?<X size={20} strokeWidth={1.5}/>:<Menu size={20} strokeWidth={1.5}/>}</button>
        </div>
      </div>
    </header>

    <div id="menu-panel" className={`menu-panel${menu?' open':''}`} aria-hidden={!menu} inert={!menu}>
      <nav aria-label="Mobile">
        {navItems.map(([id,label],i)=><button key={id} className={current===id?'current':''} style={{'--i':i}} onClick={()=>go(id)}>{label}</button>)}
      </nav>
      <div className="menu-foot">
        <a href={INSTAGRAM} target="_blank" rel="noreferrer"><InstagramIcon size={16}/>@setuju.co</a>
        <a href={SERVICES_DECK} target="_blank" rel="noreferrer"><Package size={16} strokeWidth={1.5}/>Services &amp; packages</a>
        <p>We make brands worth following.</p>
      </div>
    </div>

    <section id="top" className="hero">
      <div className="hero-copy">
        <div className="eyebrow">01 — Social Media &amp; Branding Agency</div>
        <h1>Branding Solution<br/>Partner for business,<br/><em>especially UMKM.</em></h1>
        <button className="round-link" onClick={()=>go('work')}><span>Explore work</span><b><ArrowDownRight size={15} strokeWidth={1.5}/></b></button>
      </div>
      <div className="hero-image-wrap">
        <Photo id={photos.hero[0]} alt={photos.hero[1]} className="hero-image" sizes="(max-width:800px) 100vw, 46vw" pos="center 35%" priority/>
        <a className="hero-card" href={INSTAGRAM} target="_blank" rel="noreferrer">
          <span>@setuju.co</span>
          <strong>21.6K</strong>
          <small>followers who trust us to make brands worth following.</small>
        </a>
      </div>
      <div className="hero-foot"><span>Branding · Strategy · Social Media · Photography</span><span>Scroll to explore</span></div>
    </section>

    <div className="marquee" aria-hidden="true">
      <div>{[...marquee,...marquee].map((m,i)=><span key={i}>{m}<i/></span>)}</div>
    </div>

    <section className="intro section-pad">
      <Reveal className="section-index">02 / 06</Reveal>
      <div className="intro-grid">
        <Reveal><h2>Turning ideas<br/>into <em>meaningful</em><br/>brand experiences.</h2></Reveal>
        <Reveal className="intro-side"><p><b>We make brands worth following.</b> Setuju is a Branding Solution Partner for business, especially UMKM strategy, content &amp; social media management for brands that want to stay relevant.</p><button className="text-link" onClick={()=>go('services')}>Discover Setuju</button></Reveal>
      </div>
      <Reveal className="wide-image"><Photo id={photos.studio[0]} alt={photos.studio[1]} label="Fig. 01 — Inside the studio" pos="center 60%"/></Reveal>
      <Reveal className="client-row"><span>MEET OUR CLIENTS</span><div><b>SHOESTETIC</b><b>STRAPPIE</b><b>5TO5</b><b>BEAJOVE</b><b>ERHA</b><b>LO BAN TENG</b></div></Reveal>
    </section>

    <section id="services" className="services section-pad">
      <Reveal className="section-index">03 / 06 — Setuju Services</Reveal>
      <Reveal className="section-head"><h2>More than<br/><em>services.</em></h2></Reveal>
      <div className="service-layout">
        <div className="service-list">
          {services.map((sv,i)=><button key={sv[0]} className={activeService===i?'active':''} onMouseEnter={()=>setActiveService(i)} onFocus={()=>setActiveService(i)} onClick={()=>setActiveService(i)}><small>{sv[0]}</small><span>{sv[1]}</span><span>{sv[2]}</span><span>{sv[3]}</span></button>)}
          <a className="text-link service-more" href={SERVICES_DECK} target="_blank" rel="noreferrer">See all packages</a>
        </div>
        <div className="service-visual">
          <div key={activeService} className="service-visual-in">
            <Photo id={s[4]} alt={s[5]} sizes="(max-width:800px) 100vw, 34vw"/>
            <div className="service-caption"><small>{s[0]} / 04</small><span>{s[1]}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="work" className="work section-pad">
      <Reveal className="section-index">04 / 06 — Selected Work</Reveal>
      <Reveal className="section-head"><h2>Let the work<br/><em>speak for itself.</em></h2></Reveal>
      <div className="work-stack">
        {work.map((item,i)=><Reveal key={item[0]} className="work-item">
          <a className="work-image" href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label={`${item[0]} — see more on Instagram`}>
            <Photo id={item[3]} alt={item[4]} pos={item[5]} sizes="(max-width:800px) 100vw, 1100px"/>
            <span className="work-cta" aria-hidden="true"><InstagramIcon size={18}/></span>
          </a>
          <div className="work-meta"><div><span>{item[0]}</span><small>{item[1]}</small></div><span><em>{item[2]}</em> — 0{i+1} / 04</span></div>
        </Reveal>)}
      </div>
    </section>

    <section className="photo section-pad">
      <Reveal className="section-index">05 / 06 — Photography</Reveal>
      <Reveal className="section-head"><h2>Every frame<br/>has a <em>purpose.</em></h2></Reveal>
      <div className="photo-grid">
        <Reveal className="photo-a"><Photo id={photos.product[0]} alt={photos.product[1]} label="Fig. 02" sizes="(max-width:800px) 100vw, 38vw"/></Reveal>
        <Reveal className="photo-b"><Photo id={photos.dessert[0]} alt={photos.dessert[1]} label="Fig. 03" sizes="(max-width:800px) 100vw, 28vw"/></Reveal>
        <Reveal className="photo-copy"><span>PRODUCT PHOTOGRAPHY</span><p>ERHA<br/>LO BAN TENG</p></Reveal>
        <Reveal className="photo-copy second"><span>STUDIO PHOTOGRAPHY</span><p>Selected studio work for food, beauty &amp; lifestyle brands.</p></Reveal>
      </div>
    </section>

    <section id="about" className="about section-pad">
      <div className="about-grid">
        <Reveal><span className="section-index">06 / 06</span><h2>A creative mind<br/>behind <em>Setuju.</em></h2></Reveal>
        <Reveal><Photo id={photos.founder[0]} alt={photos.founder[1]} className="portrait" sizes="(max-width:800px) 100vw, 32vw"/></Reveal>
        <Reveal className="about-copy"><span>FOUNDER</span><h3>Wenny Leo</h3><p>Founder of Setuju</p></Reveal>
      </div>
    </section>

    <section id="contact" className="contact">
      <div className="contact-inner">
        <Reveal><span className="section-index">CONTACT</span></Reveal>
        <Reveal><h2>Let's create<br/><em>something together.</em></h2></Reveal>
        <Reveal className="contact-image"><Photo id={photos.contact[0]} alt={photos.contact[1]} pos="center 55%"/></Reveal>
        <Reveal className="contact-links">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer"><small>Instagram</small><span>@setuju.co</span><InstagramIcon size={22} strokeWidth={1.25}/></a>
          <a href={SERVICES_DECK} target="_blank" rel="noreferrer"><small>Services &amp; packages</small><span>bit.ly/SetujuServices</span><Package size={22} strokeWidth={1.25}/></a>
        </Reveal>
        <Reveal className="contact-bottom"><div><span>SETUJU</span><p>We make brands worth following.<br/>Branding Solution Partner for business, especially UMKM.</p></div><button className="round-link" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><span>Back to top</span><b><ArrowUp size={15} strokeWidth={1.5}/></b></button></Reveal>
      </div>
    </section>

    <footer><span>© {new Date().getFullYear()} Setuju</span><span>Social Media &amp; Branding Agency</span><a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Setuju on Instagram"><InstagramIcon size={16}/></a></footer>
  </main>
}
