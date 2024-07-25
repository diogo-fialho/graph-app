const LABEL_TYPE = {
    number: 'number',
    date: 'date',
}

const TIME_UNITS = {
    hour: 'hour'
}

const OPTIONS_TYPE = {
    ZOOM: 'zoom',
}

// dataexample

// data: {
//     datasets: [{
//         label: 'Test Data',
//         data: data,
//         backgroundColor: [
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)',
//             'rgba(75, 192, 192, 0.2)'
//         ],
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//         showLine: true
//     }]
// }

class DfChartOptions {
    X_OPTS_DEFAULT = { type: LABEL_TYPE.number, name: 'x' };
    Y_OPTS_DEFAULT = { type: LABEL_TYPE.number, name: 'y' };
    constructor(
        text,
        x_options = this.X_OPTS_DEFAULT,
        y_options = this.Y_OPTS_DEFAULT,
        w_header = false) {
        this.text = text;
        this.x_options = x_options;
        this.y_options = y_options;
        this.w_header = w_header;
    }

    clear() {
        this.text = '';
        this.x_options = this.X_OPTS_DEFAULT;
        this.y_options = this.Y_OPTS_DEFAULT;
        this.w_header = false;
    }
    
    static loadFromSave(saveData) {
        return new DfChartOptions(
            saveData.text,
            saveData.x_options, 
            saveData.y_options,
            saveData.w_header);
    }

    loadFromForm() {
        this.text = document.getElementById('graph-name').value;
        this.x_options = this.loadLabelOptions('x');
        this.y_options = this.loadLabelOptions('y');
        this.w_header = document.getElementById('lbl-w-header').checked;
    }

    returnForSave() {
        return {
            text: this.text,
            x_options: this.x_options,
            y_options: this.y_options,
            w_header: this.w_header,
        }
    }

    fillForm() {
        document.getElementById('graph-name').value = this.text ?? '';
        document.getElementById('lbl-w-header').checked = this.w_header;
        this.fillFormLabelOptions(this.x_options);
        this.fillFormLabelOptions(this.y_options);
    }

    fillFormLabelOptions(label_opts) {
        if (!label_opts) return;

        document.getElementById(`lbl-${label_opts.name}-name`).value = label_opts.text ?? '';
        document.getElementById(`lbl-${label_opts.name}-type`).value = label_opts.type;

        switch (label_opts.type) {
            case LABEL_TYPE.date:
                document.getElementById(`lbl-${label_opts.name}-unit`).value = label_opts.unit ?? '';
                document.getElementById(`lbl-${label_opts.name}-format`).value = label_opts.format ?? '';
                break;
        }
    }
    
    loadLabelOptions(ele_base_id) {
        var lbl_type = LABEL_TYPE[document.getElementById(`lbl-${ele_base_id}-type`).value];
        var opts = {};
        switch (lbl_type) {
            case LABEL_TYPE.date:
                let format = document.getElementById(`lbl-${ele_base_id}-format`).value;
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    unit: TIME_UNITS[document.getElementById(`lbl-${ele_base_id}-unit`).value],
                    text: document.getElementById(`lbl-${ele_base_id}-name`).value,
                    format: format,
                    formatInput: (v) => formatDate(stringToDate(v.trim(), format), 'yyyy-MM-ddTHH:mm:ss.000Z'),
                    formatOutput: (v) => formatDate(new Date(v.trim()), format),
                    getMin: (vals) => Math.min.apply(null,new Date(vals)),
                    getMax: (vals) => Math.max.apply(null,new Date(vals))
                };//dd-MM-yyyy HH:mm
                break;
            default:
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    text: document.getElementById(`lbl-${ele_base_id}-name`).value,
                    formatInput: (v) => isNaN(Number.parseFloat(v)) ? undefined : Number.parseFloat(v),
                    getMin: (vals) => Math.min.apply(null,vals),
                    getMax: (vals) => Math.max.apply(null,vals)
                };

        }
        return opts;
    }

    loadScalesOptions(optsVariable) {
        var result = {
            title: {
                display: optsVariable.text_display ?? true,
                text: optsVariable.text
            }
        }
        
        if (optsVariable.type == LABEL_TYPE.date) {
            result = {
                type: 'time',
                time: {
                    unit: optsVariable.unit
                },
                title: result.title
            }
        }

        return result
    }
}

class DfBoxSelectPlugin {
    constructor(options) {
        this.options = options;
        this.ctx = document.getElementById('layer-2').getContext('2d');
        this.activeMouse = false;
        this.startCoord = undefined;
        this.lastCoord = undefined;
        this.currentSelected = undefined;
        this.lastSelected = undefined;
    }

    beforeEvent(chart, args, pluginOptions) {
        const event = args.event;
        if (!this.activeMouse && event.type == 'mousedown') {
            let canvas_client_rect = this.ctx.canvas.getBoundingClientRect();
            this.startCoord = [event.native.clientX - canvas_client_rect.left, event.native.clientY - canvas_client_rect.top, event.x, event.y];
            this.activeMouse = true
        }
        else if (this.activeMouse && event.type == 'mousemove') {
            let canvas_client_rect = this.ctx.canvas.getBoundingClientRect();
            this.lastCoord = [event.native.clientX - canvas_client_rect.left, event.native.clientY - canvas_client_rect.top, event.x, event.y];
            this.ctx.clearRect(0, 0, 1460, 730);
            this.ctx.beginPath();
            this.ctx.strokeStyle =  'red';
            this.ctx.moveTo(this.startCoord[0], this.startCoord[1]);
            this.ctx.lineTo(this.lastCoord[0], this.startCoord[1]);
            this.ctx.lineTo(this.lastCoord[0], this.lastCoord[1]);
            this.ctx.moveTo(this.startCoord[0], this.startCoord[1]);
            this.ctx.lineTo(this.startCoord[0], this.lastCoord[1]);
            this.ctx.lineTo(this.lastCoord[0], this.lastCoord[1]);
            this.ctx.stroke();
        }
        else if (this.activeMouse && event.type == 'click') {
            this.activeMouse = false;
            this.ctx.clearRect(0, 0, 1460, 730);
            if (this.lastCoord) {
                var c_dataset = chart.getDatasetMeta(0);
                this.lastSelected = c_dataset.data.filter(p =>
                    // atention, only works with circle for now, possibly
                    p.x <= this.lastCoord[2] + p.options.radius && p.x >= this.startCoord[2] - p.options.radius &&
                    p.y <= this.lastCoord[3] + p.options.radius && p.y >= this.startCoord[3] - p.options.radius
                );
            }
                
            this.startCoord = undefined;
            this.lastCoord = undefined;
            chart.render();
        }
    }

    beforeDraw(chart) {
        var canvas_secondary = document.getElementById('layer-2');
        var chart_canvas = document.getElementById('myLineChart');
        debugger
        canvas_secondary.width = chart_canvas.style.width.replace('px', '');
        canvas_secondary.height = chart_canvas.style.height.replace('px', '');
        if (this.lastSelected) {
            if (this.currentSelected)
                for (let point of this.currentSelected) {
                    point.options.backgroundColor = this.options.colors.pointBackgroundColor;   
                    point.options.borderColor = this.options.colors.pointBorderColor;   
                }
            this.currentSelected = this.lastSelected;
            this.lastSelected = undefined;
        }

        if (this.currentSelected)        
            for (let point of this.currentSelected) {
                point.options.backgroundColor = this.options.colors.pointSelectedBackgroundColor;   
                point.options.borderColor = this.options.colors.pointSelectedBorderColor;   
            }
    }
}

class DfZoomPlugin {
    constructor() {
        this.wheel = { enabled: true };
        this.pinch = { enabled: true };
        this.mode = 'xy';
    }

    toggle(chart) {
        this.wheel.enabled = !this.wheel.enabled;
        this.pinch.enabled = !this.pinch.enabled;
        chart.config.options.plugins.zoom.zoom = this.getOptions();
        chart.update();
    }

    getOptions() {
        return {
            wheel: { enabled: this.wheel.enabled },
            pinch: { enabled: this.pinch.enabled },
            mode: this.mode,
        }
    }
}


class DfChart {
    // options used in buttons
    OPTIONS = {
        zoom: { type: OPTIONS_TYPE.ZOOM, callback: () => this.zoom_plugin.toggle(this.chart)}
    }

    PLUGINS = []

    constructor(ctx, config, options = new DfChartOptions()) {
        this.options = options;
        this.PLUGINS = [
            new DfBoxSelectPlugin({ colors: config.colors })
        ]
        this.zoom_plugin = new DfZoomPlugin();
        this.ctx = ctx;
        this.tagsList = [];
        this.tags_ui_box = document.getElementById('tags-box');
        this.last_datasets = undefined;
    }

    load() {
        this.chart = new Chart(this.ctx, {
            type: 'line',
            // improve this
            plugins: this.PLUGINS,
            data: this.last_datasets,
            options: {
                // improve this
                plugins: {
                    zoom: {
                        zoom: this.zoom_plugin.getOptions()
                    }
                },
                events: ['mousedown', 'mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                scales: this.loadScales()
            }
        });
        
        for (let dts of this.chart.data.datasets) {
            for (let dt of dts.data) {
                if (dt.tag && this.tagsList.findIndex(t => t.text == dt.tag?.text) == -1)
                    this.tagsList.push(dt.tag);
            }
        }

        this.updateTagBox();
    }

    getData() {
        return this.chart.data.datasets[0].data;
    }
    
    updateTagBox() {
        this.tags_ui_box.innerHTML = '';
        for(let tag of this.tagsList) {
            var span = document.createElement('span');
            span.classList.add('span-tg');
            span.style.backgroundColor = tag.color;
            span.innerText = tag.text;
            span.addEventListener('click', () => {
                this.selectTag(tag.text);
            });

            this.tags_ui_box.appendChild(span);
        }

    }

    loadScales() {
        return { 
            x: this.options.loadScalesOptions(this.options.x_options),
            y: this.options.loadScalesOptions(this.options.y_options)
        }
    }

    deleteSelectedChartData() {
        this.chart.data.datasets[0].data = this.chart.getDatasetMeta(0).data
            .filter(p => this.PLUGINS[0].currentSelected.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) === undefined)
            .map(p => p.$context.raw);

        this.PLUGINS[0].currentSelected = [];
        this.chart.update();
    }    
    
    selectTag(tagName) {
        this.PLUGINS[0].lastSelected = this.chart.getDatasetMeta(0).data
            .filter(p => p.$context.raw?.tag?.text == tagName);

        this.chart.render();
    }

    setSelectedTagById(inputId) {
        var tagName = document.getElementById(inputId).value;
        this.setSelectedTag(tagName);
    }

    setSelectedTag(tagName) {
        let tag = { text: tagName, color: getRandomColor() };
        this.chart.data.datasets[0].data = this.chart.getDatasetMeta(0).data
            .map(p => {
                if (this.PLUGINS[0].currentSelected.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) !== undefined)
                    p.$context.raw.tag = tag;
                return p.$context.raw;
            });

        if (this.tagsList.findIndex(t => t.text == tag?.text) == -1)
            this.tagsList.push(tag);
    
        this.updateTagBox();
        this.chart.update();
    }

    exportCSV() {
        let data = this.getData();
        if (data.length > 0) {
            const headers = this.options.w_header ? [this.options.x_options.text, this.options.y_options.text, 'tag'].join(',') + '\r\n' : '';
            let rowsStr = "";
            for(let val of data) {
                let x_val = val['x'];
                let y_val = val['y'];
                if (this.options.x_options.formatOutput !== undefined)
                    x_val = this.options.x_options.formatOutput(x_val);

                if (this.options.y_options.formatOutput !== undefined)
                    y_val = this.options.y_options.formatOutput(y_val);
                
                rowsStr += [x_val, y_val, val['tag']?.text ?? ''].join(',') + '\r\n';
            }
            
            download(headers + rowsStr);
        }
    }

    readFile(file) {
        var reader = new FileReader();
        let data = [];
        let bg_colors = [];
        let bg_border_colors = [];
        reader.readAsText(file, "UTF-8");

        reader.onload = (evt) => {
            const separator = ';';
            let lines = evt.target.result.split('\r\n');
            let row = 0;
            for (var line of lines) {
                row++;
                var points = line.split(',');
                if (points.length > 1 && (!this.options.w_header || row > 1)) {
                    var val_x = this.options.x_options.formatInput(points[0]);
                    var val_y = this.options.y_options.formatInput(points[1]);
                    if (val_x == undefined || val_y == undefined)
                        continue;

                    data.push({
                        x: val_x,
                        y:  val_y,
                        tag: points[2] && points[2] != '' ? { text: points[2], color: getRandomColor() } : undefined
                    })
                    bg_colors.push(config.colors.pointBackgroundColor);
                    bg_border_colors.push(config.colors.pointBorderColor);
                }
            }
            
            this.last_datasets = {
                datasets: [{
                    label: this.options.text,
                    data: data,
                    backgroundColor: bg_colors,
                    borderColor: bg_border_colors,
                    borderWidth: 1,
                    showLine: true
                }]
            }
            this.load();
        }

        reader.onerror = function (evt) {
            console.log("error reading file");
        }

        return 
    }

    toggleOption(type) {
        this.OPTIONS[type].callback();
    }
}

class Saver {
    constructor(key) {
        this.key = key;
    }

    save(value) {
        localStorage.setItem(this.key, value);
    }

    load() {
        return localStorage.getItem(this.key);
    }
}

function toggleZoom(myLineChart) {
    myLineChart.config.options.plugins.zoom.zoom.wheel.enabled = !myLineChart.config.options.plugins.zoom.zoom.wheel.enabled;
    myLineChart.config.options.plugins.zoom.zoom.pinch.enabled = !myLineChart.config.options.plugins.zoom.zoom.pinch.enabled;
    myLineChart.update();
    
}

function formatDateToISO(dateString) {
    // formats string like '13-01-2022 00:00'
    const space_split = dateString.split(' ');

    const inverted_date = space_split[0].split('-').reverse().join('-');

    const date = new Date(`${inverted_date} ${space_split[1]}`)

    // Convert the Date object to ISO string format
    return date.toISOString();
}


function getRandomColor() {
    // thank you chatgpt
    const hexChars = '0123456789ABCDEF';
    
    // Generate a random hexadecimal value for each color component
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += hexChars[Math.floor(Math.random() * 16)];
    }

    return color;
}

// Function to download the CSV file
function download(data) {
    // Create a Blob with the CSV data and type
    const blob = new Blob([data], { type: 'text/csv' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor tag for downloading
    const a = document.createElement('a');
    
    // Set the URL and download attribute of the anchor tag
    a.href = url;
    a.download = 'download.csv';
    
    // Trigger the download by clicking the anchor tag
    a.click();
}

function formatDate(inputDate, format)  {
    if (!inputDate) return '';

    const padZero = (value) => (value < 10 ? `0${value}` : `${value}`);
    const parts = {
        yyyy: inputDate.getFullYear(),
        MM: padZero(inputDate.getMonth() + 1),
        dd: padZero(inputDate.getDate()),
        HH: padZero(inputDate.getHours()),
        hh: padZero(inputDate.getHours() > 12 ? inputDate.getHours() - 12 : inputDate.getHours()),
        mm: padZero(inputDate.getMinutes()),
        ss: padZero(inputDate.getSeconds()),
        tt: inputDate.getHours() < 12 ? 'AM' : 'PM'
    };

    return format.replace(/yyyy|MM|dd|HH|hh|mm|ss|tt/g, (match) => parts[match]);
}

function stringToDate(inputStr, format)  {
    if (!inputStr) return undefined;

    var date = new Date();
    const parts = {
        yyyy: (pos) => date.setYear(strNumOnly.slice(pos, pos + 4)),
        MM: (pos) => date.setMonth(parseInt(strNumOnly.slice(pos, pos + 2)) - 1),
        dd: (pos) => date.setDate(strNumOnly.slice(pos, pos + 2)),
        HH: (pos) => date.setHours(strNumOnly.slice(pos, pos + 2)),
        // hh: (pos) => date.setMonth(strNumOnly.slice(pos, pos + 2)),
        mm: (pos) => date.setMinutes(strNumOnly.slice(pos, pos + 2)),
        ss: (pos) => date.setSeconds(strNumOnly.slice(pos, pos + 2))
        // inputDate.getHours() < 12 ? 'AM' : 'PM'
    };
    var strNumOnly = inputStr.replace(/[^0-9]+/g, "");

    var currentPos = 0;
    format.replace(/yyyy|MM|dd|HH|hh|mm|ss|tt/g, function(a, b){
        var size = a.length;
        parts[a](currentPos);
        currentPos += size;
        return b;
    })


    return date;
}