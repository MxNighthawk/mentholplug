//
//	COPYRIGHT NIGHTHAWK 2024 - 2025. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV / NAUGHTYSNEAK)
//

let maximumHeight = 0;
let sizeTimings = {
	duration: 200,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};

class Step
{
	priceTag;
	pieceType;
	fillPercent;

	constructor(orderTiles, price, type, makeRow, includedInRow, completion)
	{
		this.priceTag = price;
		this.pieceType = type;
		this.fillPercent = completion;

		let tileContainer = orderTiles.getElementsByClassName("orderTiles")[0];
		let destiation = tileContainer;
		let colorPart = 200 + 55 * Math.pow(completion / 100, 2);

		if(makeRow)
			tileContainer.innerHTML += "<div class='tileRow'>";
		
		if(includedInRow != undefined)
			destiation = tileContainer.getElementsByClassName("tileRow")[includedInRow];

		destiation.innerHTML +=
		`<div class="orderTile" style="color: ">
			<div class="fill" style="width: ${100 - completion}%"></div>
			<p style="color: rgb(${colorPart}, ${colorPart}, ${colorPart})">
				$${this.priceTag}, ${this.pieceType}
			</p>
		</div>`;
	}
}
class OrderStrip
{
	name;
	tag;
	
	#self;
	#target = 0;
	#orignalHeight;
	#canBeClicked;

	#totalPrice = 0;
	#totalProgress = 0;

	orders = [];
	
	expandFrames;
	minimizeFrames;

	constructor(element, dateShift, metaData)
	{
		this.#self = element;
		this.name = metaData[0];
		this.tag = metaData[3];
		this.orders = metaData[4];

		const eta = this.#self.getElementsByClassName("userETA")[0];
		eta.getElementsByClassName("username")[0].innerText = this.name;
		eta.getElementsByClassName("eta")[0].innerText = `ETA: ${metaData[1]} ${metaData[2]}`;
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$999`;

		this.SetClickableState(true);
		this.#self.addEventListener("click", () =>
		{
			if(!this.#canBeClicked)
				return;

			if(this.#target == 0)
			{
				this.#target = 1;
				this.#self.style.borderRadius = "2px 2px 0px 0px";
			}
			else
			{
				this.#target = 0;
				this.#self.style.borderRadius = "2px";
			}
			
			this.#self.animate(this.#target == 1? this.expandFrames : this.minimizeFrames, sizeTimings);
		});

		for (let i = 0; i < this.orders.length; i++) {
			const element = this.orders[i];

			this.#totalPrice += element.priceTag;
			this.#totalProgress += element.fillPercent;
		}
		
		eta.getElementsByClassName("fill")[0].style.setProperty("width", `${100 - this.#totalProgress / this.orders.length}%`);
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$${this.#totalPrice}`;
		this.#self.style.width = `${316 + (164 * (metaData[2] == "Hours" || metaData[2] == "Hour" ? 0 : metaData[1] - 1))}px`;
		this.#self.style.setProperty("--leftShift", dateShift);

		let col = 0;
		switch (this.tag) {
			case "focused":
				col = 104;
				break;
			case "delayed":
				col = 15;
				break;
			default:
				col = 220;
				break;
		}

		this.#self.style.setProperty("--colorRotation", col);
	}

	MinimizePrep()
	{
		this.#orignalHeight = this.#self.clientHeight;
		
		this.expandFrames = [
			{
				height: "35px"
			},
			{
				height: `${this.#orignalHeight}px`
			}
		];
		this.minimizeFrames = [
			{
				height: `${this.#orignalHeight}px`
			},
			{
				height: "35px"
			}
		];

		this.#self.animate(this.minimizeFrames, sizeTimings);
	}

	SetClickableState(state)
	{
		this.#canBeClicked = state;
		this.#self.style.opacity = state ? "1" : "0.25";
		this.#self.style.cursor = this.#canBeClicked ? "pointer" : "default";
	}
}

let order = document.getElementsByClassName("order");
let stripParent = document.getElementById("orderStrips");

//How many columns to shift all the strips by. (4 = 1 day, 8 = 2 days, etc.)
stripParent.style.setProperty("--leftShift", 4);

let orderStrips =
[
	new OrderStrip(order[0], 0,
	["Customer Name", 1, "Days", "", 
		[
			new Step(order[0], 10, "Sketch", true, 0, 0),
			new Step(order[0], 10, "Lineart", true, 0, 0),
			new Step(order[0], 10, "Color", false, undefined, 0),
		]
	]),
];
let focused = [], delayed = [], queued = [];