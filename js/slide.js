export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }

  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  uptadePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.3;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    let movetype;
    if(event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = 'mousemove';
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype ='touchmove'
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') 
      ? event.clientX
      : event.changedTouches[0].clientX;

    const finalPosition = this.uptadePosition(pointerPosition)
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const movetype = (event.type === 'mouseup')
      ? 'mousemove'
      : 'touchmove'
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if ((this.dist.movement > this.wrapper.offsetWidth / 2) && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if ((this.dist.movement < -(this.wrapper.offsetWidth / 2)) && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    ['touchstart','mousedown'].forEach(event => {
      this.wrapper.addEventListener(event, this.onStart);
    });
    ['touchend','mouseup'].forEach(event => {
      this.wrapper.addEventListener(event, this.onEnd);
    });
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  // Calcula a posição do slide para colocar ele exatamente no centro.
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2 ;
    return -(slide.offsetLeft - margin)
  }
  
  // Slides config
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position =  this.slidePosition(element);
      return {
        position,
        element
      }
    })
  }

  // Função que salva o index do slide em um objeto.
  slideIndexNav(index) {
    const last = --this.slideArray.length;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    }
  }

  // Muda o item do  slide de acordo com o index que passarmos
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
  }

  // Active the previous slide.
  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    } 
  }

  // Active the next slide 
  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    } 
  }

  init() {
    this.transition(true);
    this.bindEvents();
    this.addSlideEvents();
    this.slidesConfig();
    return this;
  }
}