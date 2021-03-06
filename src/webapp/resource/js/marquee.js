var Marquee = function() {
		this.ID = document.getElementById(arguments[0]);
		this.Direction = arguments[1];
		this.Step = arguments[2];
		this.BakStep = arguments[2];
		this.Width = arguments[3];
		this.HalfWidth = Math.round(arguments[3] / 2);
		this.Height = arguments[4];
		this.Timer = arguments[5];
		this.DelayTime = arguments[6];
		this.WaitTime = arguments[7];
		if (arguments[8] || arguments[8] == 0) {
			this.ScrollStep = arguments[8];
		} else {
			this.ScrollStep = this.Direction > 1 ? this.Width : this.Height;
		}
		this.Correct = 0;
		this.CTL = 0;
		this.StartID = 0;
		this.Stop = 0;
		this.MouseOver = 0;
		this.ID.style.overflow = "hidden";
		this.ID.style.overflowX = "hidden";
		this.ID.style.overflowY = "hidden";
		this.ID.noWrap = true;
		this.ID.style.width = this.Width + "px";
		this.ID.style.height = this.Height + "px";
		this.ClientScroll = this.Direction > 1 ? parseInt(this.ID.scrollWidth)
				: parseInt(this.ID.scrollHeight);
		this.ID.innerHTML += this.ID.innerHTML;
		this.IsNotOpera = (navigator.userAgent.toLowerCase().indexOf("opera") == -1);
		if (arguments.length >= 8) {
			this.Start(this, this.Timer, this.DelayTime, this.WaitTime);
		}
	}
	Marquee.prototype.Start = function(msobj, timer, delaytime, waittime) {
		msobj.StartID = function() {
			msobj.Scroll();
		};
		msobj.Continue = function() {
			if (msobj.MouseOver == 1) {
				setTimeout(msobj.Continue, delaytime);
			} else {
				clearInterval(msobj.TimerID);
				msobj.CTL = 0;
				msobj.Stop = 0;
				msobj.TimerID = setInterval(msobj.StartID, timer);
			}
		};
		msobj.Pause = function() {
			msobj.Stop = 1;
			clearInterval(msobj.TimerID);
			setTimeout(msobj.Continue, delaytime);
		};
		msobj.Begin = function() {
			msobj.ID.onmousemove = function(evt) {
				if (msobj.ScrollStep == 0 && msobj.Direction > 1) {
					var event = null;
					if (window.event) {
						event = window.event;
						if (msobj.IsNotOpera) {
							msobj.EventLeft = event.srcElement.id == msobj.ID.id ? parseInt(event.offsetX)
									- parseInt(msobj.ID.scrollLeft)
									: parseInt(event.srcElement.offsetLeft)
											- parseInt(msobj.ID.scrollLeft)
											+ parseInt(event.offsetX);
						} else {
							msobj.ScrollStep = null;
							return;
						}
					} else {
						event = evt;
						msobj.EventLeft = parseInt(event.layerX)
								- parseInt(msobj.ID.scrollLeft);
					}
					msobj.Direction = msobj.EventLeft > msobj.HalfWidth ? 3 : 2;
					msobj.AbsCenter = Math.abs(msobj.HalfWidth
							- msobj.EventLeft);
					msobj.Step = Math.round(msobj.AbsCenter
							* (msobj.BakStep * 2) / msobj.HalfWidth);
				}
			};
			msobj.ID.onmouseover = function() {
				if (msobj.ScrollStep == 0) {
					return;
				}
				msobj.MouseOver = 1;
				clearInterval(msobj.TimerID);
			};
			msobj.ID.onmouseout = function() {
				if (msobj.ScrollStep == 0) {
					if (msobj.Step == 0) {
						msobj.Step = 1;
					}
					return;
				}
				msobj.MouseOver = 0;
				if (msobj.Stop == 0) {
					clearInterval(msobj.TimerID);
					msobj.TimerID = setInterval(msobj.StartID, timer);
				}
			};
			msobj.TimerID = setInterval(msobj.StartID, timer);
		};
		setTimeout(msobj.Begin, waittime);
	}
	Marquee.prototype.Scroll = function() {
		if (this.Correct == 0 && this.CTL > this.ClientScroll) {
			this.ClientScroll = (this.Direction > 1) ? Math
					.round(parseInt(this.ID.scrollWidth) / 2) : Math
					.round(parseInt(this.ID.scrollHeight) / 2);
			this.Correct = 1;
		}
		switch (this.Direction) {
		case 0: {
			this.CTL += this.Step;
			if (this.CTL >= this.ScrollStep && this.DelayTime > 0) {
				this.ID.scrollTop += (this.ScrollStep + this.Step - this.CTL);
				this.Pause();
				return;
			} else {
				if (this.ID.scrollTop >= this.ClientScroll) {
					this.ID.scrollTop -= this.ClientScroll;
				}
				this.ID.scrollTop += this.Step;
			}
			break;
		}
		case 1: {
			this.CTL += this.Step;
			if (this.CTL >= this.ScrollStep && this.DelayTime > 0) {
				this.ID.scrollTop -= (this.ScrollStep + this.Step - this.CTL);
				this.Pause();
				return;
			} else {
				if (this.ID.scrollTop <= 0) {
					this.ID.scrollTop += this.ClientScroll;
				}
				this.ID.scrollTop -= this.Step;
			}
			break;
		}
		case 2: {
			this.CTL += this.Step;
			if (this.CTL >= this.ScrollStep && this.DelayTime > 0) {
				this.ID.scrollLeft += (this.ScrollStep + this.Step - this.CTL);
				this.Pause();
				return;
			} else {
				if (this.ID.scrollLeft >= this.ClientScroll) {
					this.ID.scrollLeft -= this.ClientScroll;
				}
				this.ID.scrollLeft += this.Step;
			}
			break;
		}
		case 3: {
			this.CTL += this.Step;
			if (this.CTL >= this.ScrollStep && this.DelayTime > 0) {
				this.ID.scrollLeft -= (this.ScrollStep + this.Step - this.CTL);
				this.Pause();
				return;
			} else {
				if (this.ID.scrollLeft <= 0) {
					this.ID.scrollLeft += this.ClientScroll;
				}
				this.ID.scrollLeft -= this.Step;
			}
			break;
		}
			this.ID.scrollTop += "px";
			this.ID.scrollLeft += "px";
		}
	}