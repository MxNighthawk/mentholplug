//
//	COPYRIGHT NIGHTHAWK 2024. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

class Draggable
{
	elmement;
	draggable;

	xShift = 0;
	lastX = 0;

	yShift = 0;
	lastY;

	lastXShift = 0;
	lastYShift = 0;

	rightClamp = 0;

	constructor(dragContainer, dragItems, rightShift = 0)
	{
		this.elmement = dragContainer;
		this.draggable = dragItems;
		this.rightClamp = rightShift;
		this.GenerateDrag();
	}
	GenerateDrag()
	{
		this.elmement.addEventListener("mousemove", (e) =>
		{
			this.DragRoadmap(e, false);
		});
		this.elmement.addEventListener("touchstart", (e) =>
		{
			this.xShift = this.lastX = e.touches[0].pageX;
			this.yShift = this.lastY = e.touches[0].pageY;
		}, {passive: true});
		this.elmement.addEventListener("touchmove", (e) =>
		{
			e.preventDefault();
			this.DragRoadmap(e, true);
		});
	}

	DragRoadmap(e, isTouch)
	{
		let x = isTouch ? e.touches[0].pageX : e.pageX;
		let y = isTouch ? e.touches[0].pageY : e.pageY;
		
		if(!isTouch && e.buttons != 1)
		{
			this.xShift = this.lastX = x;
			this.yShift = this.lastY = y;
			return;
		}
		
		if(this.draggable.scrollWidth > this.elmement.clientWidth)
		{
			this.xShift = x - this.lastX;
			this.lastX = x;
			this.lastXShift += this.xShift;
			this.lastXShift = Clamp(this.lastXShift, this.elmement.clientWidth - this.draggable.scrollWidth + this.rightClamp, 0);
			this.draggable.style.setProperty("left", `${this.lastXShift}px`);
		}
		else if(this.draggable.clientWidth < this.elmement.clientWidth)
			this.draggable.style.setProperty("left", `0px`);

		if(this.draggable.scrollHeight > this.elmement.clientHeight)
		{
			this.yShift = y - this.lastY;
			this.lastY = y;
			this.lastYShift += this.yShift;
			this.lastYShift = Clamp(this.lastYShift, this.elmement.clientHeight - this.draggable.scrollHeight, 0);
			this.draggable.style.setProperty("top", `${this.lastYShift}px`);
		}
		else if(this.draggable.clientHeight < this.elmement.clientHeight)
			this.draggable.style.setProperty("top", `0px`);
	}
}