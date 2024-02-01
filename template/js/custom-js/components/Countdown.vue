<template>
    <ul v-if="date > now" class="countdown">
        <li v-if="days > 0">
            <p class="digit">{{ days | twoDigits }}</p>
            <p class="text">{{ days > 1 ? 'dias' : 'dia' }}</p>
        </li>
        <li>
            <p class="digit">{{ hours | twoDigits }}</p>
            <p class="text">{{ hours > 1 ? 'horas' : 'hora' }}</p>
        </li>
        <li>
            <p class="digit">{{ minutes | twoDigits }}</p>
            <p class="text">min</p>
        </li>
        <li>
            <p class="digit">{{ seconds | twoDigits }}</p>
            <p class="text">seg</p>
        </li>
    </ul>
</template>

<script>
let interval = null;

export default {
    name: 'countdown',
    props: {
        product: {
            type: Object
        },
        deadline: {
            type: String
        },
        end: {
            type: String
        },
        stop: {
            type: Boolean
        }
    },
    data() {
        return {
            now: Math.trunc((new Date()).getTime() / 1000),
            date: null,
            diff: 0
        }
    },
    created() {
        if (!this.deadline && !this.end) {
            throw new Error("Missing props 'deadline' or 'end'");
        }

        let endTime = this.endDate;
        this.date = Math.trunc((new Date(endTime)).getTime() / 1000);

        if (!this.date) {
            throw new Error("Invalid props value, correct the 'deadline' or 'end'");
        }

        interval = setInterval(() => {
            this.now = Math.trunc((new Date()).getTime() / 1000);
        }, 1000);
    },
    computed: {
        seconds() {
            return Math.trunc(this.diff) % 60
        },

        minutes() {
            return Math.trunc(this.diff / 60) % 60
        },

        hours() {
            return Math.trunc(this.diff / 60 / 60) % 24
        },

        days() {
            return Math.trunc(this.diff / 60 / 60 / 24)
        },

        endDate () {
            let promoDates = this.product.price_effective_date
            if (promoDates) {
                let now = new Date()
                if (promoDates.end) {
                    if (new Date(promoDates.end) > now) {
                    return new Date(promoDates.end).toISOString()
                    }
                } else if(promoDates.start) {
                    if (new Date(promoDates.start) > now) {
                    return new Date(promoDates.start).toISOString()
                    }
                }
            }
            return this.deadline
        },
    },
    watch: {
        now(value) {
            console.log(value)
            this.diff = this.date - this.now;
            console.log(this.diff)
            if(this.diff <= 0 || this.stop){
                this.diff = 0;
                // Remove interval
                clearInterval(interval);
            }
        }
    },
    filters: {
        twoDigits(value) {
            if ( value.toString().length <= 1 ) {
                return '0'+value.toString()
            }
            return value.toString()
        }
    },
    destroyed() {
        clearInterval(interval);
    }
}
</script>
<style>
.countdown {
  padding: 0;
  margin: 0;
}
.countdown li {
  display: inline-block;
  margin: 0 8px;
  text-align: center;
  position: relative;
}
.countdown li p {
    margin: 0;
}
.countdown li:after {
  content: ":";
  position: absolute;
  top: 0;
  right: -13px;
  font-size: 32px;
}

.countdown li:first-of-type {
  margin-left: 0;
}
.countdown li:last-of-type {
  margin-right: 0;
}
.countdown li:last-of-type:after {
  content: "";
}
.countdown .digit {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0;
  color: #df0174 !important;
}
.countdown .text {
  text-transform: uppercase;
  margin-bottom: 0;
  font-size: 10px;
  color: #df0174 !important
}

@media(max-width: 410px) {
    .countdown li:after, .countdown .digit {
        font-size: 23px !important;
    }
}
</style>
