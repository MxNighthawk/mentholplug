//
//	COPYRIGHT NIGHTHAWK 2024 - 2025. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV)
//

let dateStamps = document.getElementsByClassName("dateStamp");

let colorTags = document.getElementsByClassName("state");
let nameSearch = document.getElementById("nameSearch");
let pacificTime = document.getElementById("localTime");

let map = document.getElementById("mapArea");
let mapDrag = document.getElementById("mapDrag");

new Draggable(map, mapDrag);

let today = new Date();
today.setUTCHours(today.getUTCHours() - 5);

let resize;
let use12HourCycle = true, isFocused = false;

function Clamp(f, min, max)
{
	if(f < min)
		f = min;
	else if(f > max)
		f = max;

	return f;
}
let filterName = "";

for (let i = 0; i < dateStamps.length; i++) {
	const element = dateStamps[i];
	
	var d = new Date("Feburary, 2025");
	d.setUTCDate(d.getUTCDate() + i);
	d.setUTCHours(today.getUTCHours());
	
	element.innerHTML = `${d.getUTCMonth() + 1} / ${d.getUTCDate()} / ${d.getUTCFullYear()}`;
	if(today.getUTCDate() == d.getUTCDate() && today.getUTCMonth() == d.getUTCMonth())
		element.parentElement.classList.add("currentDay");
}

setInterval(() => {
	DisplayRelativeTime();
}, 500);

function DisplayRelativeTime()
{
	let pacific = new Date();
	pacific.setUTCHours(pacific.getUTCHours() - 5);
	
	let hour = pacific.getUTCHours();
	let minutes = pacific.getUTCMinutes();
	let seconds = pacific.getUTCSeconds();

	let mins = minutes < 10 ? `0${minutes}` : minutes;
	let secs = seconds < 10 ? `0${seconds}` : seconds;

	if(!use12HourCycle)
		pacificTime.innerText = `Artist Timezone - ${hour}:${mins}:${secs}`;
	else
		pacificTime.innerText = `Artist Timezone - ${hour > 12 ? hour - 12 : hour}:${mins}:${secs} ${parseInt(hour / 12) == 1 ? "PM" : "AM"}`;		
}

function SwapTimeFormat()
{
	use12HourCycle = !use12HourCycle;
	DisplayRelativeTime();
}

function PrepSizes()
{
	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];
		element.MinimizePrep();

		switch (element.tag) {
			case "focused":
				focused.push(element);
				break;
			case "delayed":
				delayed.push(element);
				break;
			default:
				queued.push(element);
				break;
		}
	}
}

map.addEventListener("click", (e) => 
{
	clearInterval(resize);
	ResizeBottom();
});
map.addEventListener("touchend", (e) => 
{
	clearInterval(resize);
	ResizeBottom();
});

function FilterByColor(id)
{
	let stack = id == 0 ? focused : id == 1 ? delayed : queued;
	colorTags[id].style.setProperty("opacity", getComputedStyle(colorTags[id]).opacity == 1 ? 0.25 : 1);

	for (let i = 0; i < stack.length; i++) {
		const element = stack[i];
		element.SetClickableState(getComputedStyle(colorTags[id]).opacity == 1 && (filterName == "" || element.name == filterName));
	}
}
function FilterByName()
{
	filterName = nameSearch.value;

	for (let i = 0; i < orderStrips.length; i++) {
		const element = orderStrips[i];

		let toggleID = element.tag == "focused" ? 0 : element.tag == "delayed" ? 1 : 2;

		element.SetClickableState((filterName == "" || element.name == filterName) && getComputedStyle(colorTags[toggleID]).opacity == 1);
	}
}
function ResizeBottom()
{
	resize = setInterval(() => {
		if(mapDrag.getBoundingClientRect().bottom < map.getBoundingClientRect().bottom)
		{
			V_lastShift = map.clientHeight - mapDrag.scrollHeight;
			mapDrag.style.setProperty("top", `${V_lastShift}px`);
		}
		else
			clearInterval(resize);
	}, 25);
}
