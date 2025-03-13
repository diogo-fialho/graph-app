const LABEL_TYPE = {
    number: 'number',
    date: 'date',
}

const TIME_UNITS = {
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    quarter: 'quarter',
    year: 'year'
}

const OPTIONS_TYPE = {
    ZOOM: 'zoom',
}

const TAG_COL = 'tags';

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

class DfLabelOptions {
    constructor(type, name) {
        this.type = type
        this.name = name
    }

    formatInput(value) {
        return value;
    }

    formatOutput(value) {
        return value;
    }
    
    static loadLabelOptions(header, example_value) {
        // let date_format = DfDateLabelOptions.identifyFormat(example_value);
        // if (date_format) {
        //     // CONTINUE
        //     let result = new DfDateLabelOptions(lbl_name, );

        // }
        switch (lbl_type) {
            case LABEL_TYPE.date:
                let result = new DfLabelOptions(lbl_type, lbl_name);

                let format = document.getElementById(`lbl-${ele_base_id}-format-${id}`).value;
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    unit: TIME_UNITS[document.getElementById(`lbl-${ele_base_id}-unit-${id}`).value],
                    text: document.getElementById(`lbl-${ele_base_id}-name-${id}`).value,
                    format: format,
                };//dd-MM-yyyy HH:mm
                break;
            default:
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    text: document.getElementById(`lbl-${ele_base_id}-name-${id}`).value,
                    formatInput: (v) => isNaN(Number.parseFloat(v)) ? undefined : Number.parseFloat(v),
                    getMin: (vals) => Math.min.apply(null,vals),
                    getMax: (vals) => Math.max.apply(null,vals)
                };

        }
        return opts;
    }
}
class DfDateLabelOptions extends DfLabelOptions {
    constructor(name, format) {
        super(LABEL_TYPE.DATE, name)
        this.format = format
    }
    // yyyy: inputDate.getFullYear(),
    // MM: padZero(inputDate.getMonth() + 1),
    // dd: padZero(inputDate.getDate()),
    // HH: padZero(inputDate.getHours()),
    // hh: padZero(inputDate.getHours() > 12 ? inputDate.getHours() - 12 : inputDate.getHours()),
    // mm: padZero(inputDate.getMinutes()),
    // ss: padZero(inputDate.getSeconds()),
    // tt: inputDate.getHours() < 12 ? 'AM' : 'PM'

    static identifyFormat(value) {
        const seperators = ['-', '/', '.']
        let formatss = []
        for (let sep of seperators) {
            formatss.push({ regex: /^\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2}$/, formats: [ `yyyy${sep}MM${sep}dd`, `yyyy${sep}dd${sep}MM`] });
            formatss.push({ regex: /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4}$/, formats: [ `dd${sep}MM${sep}yyyy`, `MM${sep}dd${sep}yyyy`] });
            formatss.push({ regex: /^\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}$/, formats: [ `yyyy${sep}MM${sep}ddTHH:mm:ss`, `yyyy${sep}dd${sep}MMTHH:mm:ss`] });
            formatss.push({ regex: /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4}T\d{1,2}:\d{1,2}:\d{1,2}$/, formats: [ `dd${sep}MM${sep}yyyyTHH:mm:ss`, `MM${sep}dd${sep}yyyyTHH:mm:ss`] });
            formatss.push({ regex: /^\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/, formats: [ `yyyy${sep}MM${sep}dd HH:mm:ss`, `yyyy${sep}dd${sep}MM HH:mm:ss`] });
            formatss.push({ regex: /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4} \d{1,2}:\d{1,2}:\d{1,2}$/, formats: [ `dd${sep}MM${sep}yyyy HH:mm:ss`, `MM${sep}dd${sep}yyyy HH:mm:ss`] });
            formatss.push({ regex: /^\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2} \d{1,2}:\d{1,2}$/, formats: [ `yyyy${sep}MM${sep}dd HH:mm`, `yyyy${sep}dd${sep}MM HH:mm`] });
            formatss.push({ regex: /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4} \d{1,2}:\d{1,2}$/, formats: [ `dd${sep}MM${sep}yyyy HH:mm`, `MM${sep}dd${sep}yyyy HH:mm`] });
            formatss.push({ regex: /^\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2} \d{1,2}$/, formats: [ `yyyy${sep}MM${sep}dd HH`, `yyyy${sep}dd${sep}MM HH`] });
            formatss.push({ regex: /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{4} \d{1,2}$/, formats: [ `dd${sep}MM${sep}yyyy HH`, `MM${sep}dd${sep}yyyy HH`] });
        }

        for (const { regex, formats } of formatss) {
            if (regex.test(value)) {
                let v_f = []
                for (let f of formats) {
                    let date = stringToDate(value, f);
                    if (date.getDate() !== NaN)
                        v_f.push(f);
                }
                if (v_f.length > 0)
                    return v_f;
            }
        }

        return undefined;
    }

    formatInput(value) {
        return formatDate(stringToDate(value.trim(), format), 'yyyy-MM-ddTHH:mm:ss.000Z')
    }

    formatOutput(value) {
        return formatDate(new Date(v.trim()), format);
    }

    getMin(vals) {
        return Math.min.apply(null,new Date(vals));
    }

    getMax(vals) {
        return Math.max.apply(null,new Date(vals));
    }
}

class DfNumberLabelOptions extends DfLabelOptions {
    constructor(name) {
        super(LABEL_TYPE.DATE, name)
    }

    formatInput(value) {
        return isNaN(Number.parseFloat(v)) ? undefined : Number.parseFloat(v);
    }

    getMin(vals) {
        return Math.min.apply(null, vals);
    }

    getMax(vals) {
        return Math.max.apply(null, vals);
    }
}


class DfChartOptions {
    X_OPTS_DEFAULT = { type: LABEL_TYPE.number, name: 'x' };
    Y_OPTS_DEFAULT = { type: LABEL_TYPE.number, name: 'y' };
    constructor(
        text,
        x_options = this.X_OPTS_DEFAULT,
        y_options = this.Y_OPTS_DEFAULT,
        w_header = false,
        file_id = undefined,
        w_line = false,
        w_corr_line = false) {
        this.text = text;
        this.x_options = x_options;
        this.y_options = y_options;
        this.w_header = w_header;
        this.file_id = file_id;
        this.color = getRandomColor();
        this.w_line = w_line;
        this.w_corr_line = w_corr_line;
    }
    
    loadFromSave(saveData) {
        this.text = saveData.text;
        this.x_options = saveData.x_options;
        this.y_options = saveData.y_options;
        this.w_header = saveData.w_header;
    }

    loadFromForm(id) {
        this.text = document.getElementById(`graph-name-${id}`).value;
        this.x_options = this.loadLabelOptions(id, 'x');
        this.y_options = this.loadLabelOptions(id, 'y');
        this.w_header = document.getElementById(`lbl-w-header-${id}`).checked;
        this.file_id = document.querySelector(`#drop-area-${id} .file-id`).value;
        this.w_line = document.getElementById(`lbl-w-line-${id}`).checked;
        this.w_corr_line = document.getElementById(`lbl-w-corr-line-${id}`).checked;
    }

    returnForSave() {
        return {
            text: this.text,
            x_options: this.x_options,
            y_options: this.y_options,
            w_header: this.w_header,
        }
    }

    fillForm(id) {
        document.getElementById(`graph-name-${id}`).value = this.text ?? '';
        document.getElementById(`lbl-w-header-${id}`).checked = this.w_header;
        document.querySelector(`#drop-area-${id} .file-id`).value = this.file_id;
        this.fillFormLabelOptions(id, this.x_options);
        this.fillFormLabelOptions(id, this.y_options);
    }

    fillFormLabelOptions(id, label_opts) {
        if (!label_opts) return;

        document.getElementById(`lbl-${label_opts.name}-col-${id}`).value = label_opts.text ?? '';
        document.getElementById(`lbl-${label_opts.name}-type-${id}`).value = label_opts.type;

        switch (label_opts.type) {
            case LABEL_TYPE.date:
                document.getElementById(`lbl-${label_opts.name}-unit-${id}`).value = label_opts.unit ?? '';
                document.getElementById(`lbl-${label_opts.name}-format-${id}`).value = label_opts.format ?? '';
                break;
        }
    }
    
    loadLabelOptions(id, ele_base_id) {
        var lbl_type = LABEL_TYPE[document.getElementById(`lbl-${ele_base_id}-type-${id}`).value];
        var opts = {};
        switch (lbl_type) {
            case LABEL_TYPE.date:
                let format = document.getElementById(`lbl-${ele_base_id}-format-${id}`).value;
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    unit: TIME_UNITS[document.getElementById(`lbl-${ele_base_id}-unit-${id}`).value],
                    key: document.getElementById(`lbl-${ele_base_id}-col-${id}`).value,
                    text: document.getElementById(`lbl-${ele_base_id}-name-${id}`).value,
                    format: format,
                    formatInput: (v) => stringToDate(v.trim(), format)?.getTime(),
                    formatOutput: (v) => formatDate(new Date(v), format),
                    getMin: (vals) => Math.min.apply(null,new Date(vals)),
                    getMax: (vals) => Math.max.apply(null,new Date(vals))
                };//dd-MM-yyyy HH:mm
                break;
            default:
                opts = {
                    name: ele_base_id,
                    type: lbl_type,
                    key: document.getElementById(`lbl-${ele_base_id}-col-${id}`).value,
                    text: document.getElementById(`lbl-${ele_base_id}-name-${id}`).value,
                    formatInput: (v) => isNaN(Number.parseFloat(v)) ? undefined : Number.parseFloat(v),
                    getMin: (vals) => Math.min.apply(null,vals),
                    getMax: (vals) => Math.max.apply(null,vals)
                };

        }
        return opts;
    }

    loadScalesOptions(optsVariable) {
        var result = {
            display: true,
            title: {
                display: optsVariable.text_display ?? true,
                text: optsVariable.text
            }
        }

        if (optsVariable.type == LABEL_TYPE.number) {
            result.type = 'linear';
        }
        else if (optsVariable.type == LABEL_TYPE.date) {
            var timeOpts = {
                unit: optsVariable.unit,
                displayFormats: {}
            }
            timeOpts.displayFormats[optsVariable.unit] = optsVariable.format;
            result = {
                display: result.display,
                type: 'time',
                time: timeOpts,
                title: result.title
            }
        }

        return result;
    }
}

class DfBoxSelectPlugin {
    constructor(options) {
        this.options = options;
        this.ctx2 = document.getElementById(`layer-2-${options.graphId}`).getContext('2d');
        this.activeMouse = false;
        this.startCoord = undefined;
        this.lastCoord = undefined;
        this.currentSelected = {};
        this.lastSelected = {};
        this.updateLastSelected = false;
    }

    beforeEvent(chart, args, pluginOptions) {
        const event = args.event;
        const is_blocked = KEYS_ACTIVE.includes(KEYS_TO_VALIDATE.ctrl.code[0]);
        if (!is_blocked) {
            // by default do zoom behaviour
            // only if left click
            const leftClick = event.native.button == 0;
            if (leftClick) {
                const selectData = KEYS_ACTIVE.includes(KEYS_TO_VALIDATE.alt.code[0]);
                if (!this.activeMouse && event.type == 'mousedown') {
                    let points_in_evt = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        
                    // no points touched, start select box
                    if (points_in_evt.length == 0) {
                        let canvas_client_rect = this.ctx2.canvas.getBoundingClientRect();
                        this.startCoord = [event.native.clientX - canvas_client_rect.left, event.native.clientY - canvas_client_rect.top, event.x, event.y];
                        this.activeMouse = true;
                    }
                    else {
                        let idx = points_in_evt[0].datasetIndex.toString();
                        if (!this.currentSelected[idx]) {
                            this.currentSelected[idx] = []
                        }
                        
                        let existing_idx = this.currentSelected[idx].findIndex(v => v.$context.dataIndex == points_in_evt[0].index);
                        if (existing_idx == -1)
                            this.currentSelected[idx].push(points_in_evt[0].element);
                        else
                            this.currentSelected[idx].splice(existing_idx, 1);
        
                    }
                }
                else if (this.activeMouse && event.type == 'mousemove') {
                    let canvas_client_rect = this.ctx2.canvas.getBoundingClientRect();
                    this.lastCoord = [event.native.clientX - canvas_client_rect.left, event.native.clientY - canvas_client_rect.top, event.x, event.y];
                    this.ctx2.clearRect(0, 0, this.ctx2.canvas.width, this.ctx2.canvas.height);
                    this.ctx2.beginPath();
                    const color = !selectData ? this.options.colors.selectBoxColor : this.options.colors.zoomBoxColor;
                    this.ctx2.fillStyle = color.convertToRGBA(0.2);
                    this.ctx2.strokeStyle = color;
    
                    const minX = this.lastCoord[0] > this.startCoord[0] ? this.startCoord[0] : this.lastCoord[0];
                    const minY = this.lastCoord[1] > this.startCoord[1] ? this.startCoord[1] : this.lastCoord[1];
                    const width = this.lastCoord[0] > this.startCoord[0] ? this.lastCoord[0] - this.startCoord[0] : this.startCoord[0] - this.lastCoord[0];
                    const height = this.lastCoord[1] > this.startCoord[1] ? this.lastCoord[1] - this.startCoord[1] : this.startCoord[1] - this.lastCoord[1];
                    this.ctx2.fillRect(minX, minY, width, height);
                    this.ctx2.strokeRect(minX, minY, width, height);
                    this.ctx2.stroke();
                }
                else if (this.activeMouse && event.type == 'click') {
                    this.activeMouse = false;
                    this.ctx2.clearRect(0, 0, this.ctx2.canvas.width, this.ctx2.canvas.height);
                    if (this.lastCoord) {
                        if (!selectData) {
                            let data_se = [];
                            for (let i = 0; i < chart.data.datasets.length; i++) {
                                var c_dataset = chart.getDatasetMeta(i);
                                data_se[i.toString()] = c_dataset.data.filter(p =>
                                    // atention, only works with circle for now, possibly
                                    p.x <= this.lastCoord[2] + p.options.radius && p.x >= this.startCoord[2] - p.options.radius &&
                                    p.y <= this.lastCoord[3] + p.options.radius && p.y >= this.startCoord[3] - p.options.radius
                                );
                            }
                            
                            this.lastSelected = data_se;
                            this.updateLastSelected = true;
                        }
                        else {
                            var xScale = chart.scales.x;
                            var yScale = chart.scales.y;
        
                            var startXValue = xScale.getValueForPixel(this.startCoord[0]);
                            var lastXValue = xScale.getValueForPixel(this.lastCoord[0]);
                            var startYValue = yScale.getValueForPixel(this.startCoord[1]);
                            var lastYValue = yScale.getValueForPixel(this.lastCoord[1]);
                            var newXMin = startXValue < lastXValue ? startXValue : lastXValue;
                            var newXMax = startXValue < lastXValue ? lastXValue : startXValue;
                            var newYMin = startYValue < lastYValue ? startYValue : lastYValue;
                            var newYMax = startYValue < lastYValue ? lastYValue : startYValue;
                            // Use the zoom function to zoom into the new range
                            chart.zoomScale('x', { min: newXMin, max: newXMax });
                            chart.zoomScale('y', { min: newYMin, max: newYMax });
                        }
                    }
                        
                    this.startCoord = undefined;
                    this.lastCoord = undefined;
                    chart.render();
                }
            }
            
        }
    }

    beforeDraw(chart) {
        var canvas_secondary = document.getElementById(`layer-2-${this.options.graphId}`);
        var chart_canvas = chart.canvas;
        if (chart_canvas.style.width.replace('px', '') != this.ctx2.canvas.width) {
            // ATENTION: from w3schools, Tip: Each time the height or width of a canvas is re-set, the canvas content will be cleared (see example at bottom of page).
            this.ctx2.canvas.width = chart_canvas.style.width.replace('px', '');
            this.ctx2.canvas.height = chart_canvas.style.height.replace('px', '');
        }

        if (this.updateLastSelected) {
            let curr_selected_keys = Object.keys(this.currentSelected);
            if (curr_selected_keys.length > 0)
                for (let key of curr_selected_keys) {
                    let points = this.currentSelected[key];
                    for (let point of points) {
                        point.options.backgroundColor = point.options.originalColor;   
                        point.options.borderColor = point.options.originalBorderColor;   
                    }
                }

            this.currentSelected = this.lastSelected;
            this.lastSelected = {};
            this.updateLastSelected = false;
        }

        let curr_select_keys = Object.keys(this.currentSelected);
        if (curr_select_keys.length > 0)    
            for (let key of curr_select_keys) {
                let points = this.currentSelected[key];
                for (let point of points) {
                    if (!point.options.originalColor) {
                        point.options.originalColor = point.options.backgroundColor;
                        point.options.originalBorderColor = point.options.borderColor;
                    }
                    point.options.backgroundColor = this.options.colors.pointSelectedBackgroundColor;   
                    point.options.borderColor = this.options.colors.pointSelectedBorderColor;
                }
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

    constructor(id, ctx, options_list = [], ctxMenu = undefined) {
        this.colors = {
            pointSelectedBackgroundColor: '#D65A2F'.convertToRGBA(0.7),
            pointSelectedBorderColor: '#D65A2F',
            selectBoxColor: '#D65A2F',
            zoomBoxColor: '#34D62F'
        };
        this.id = id;
        this.options_list = options_list;
        this.PLUGINS = [
            new DfBoxSelectPlugin({ graphId: id, colors: this.colors })
        ]
        this.zoom_plugin = new DfZoomPlugin();
        this.ctx = ctx;
        this.tagsList = [];
        this.tags_ui_box = document.getElementById(`tags-box-${id}`);
        this.deletedDataMaxLenght = 5;
        this.deletedData = [];
        this.ctxMenu = Object.assign({}, ctxMenu);
    }

    loadDatasets(data_loaded) {
        let datasets = []
        let dataSetIdx = 0;
        for (let options of this.options_list) {
            let dataset_data = []
            let bg_colors = []
            let bg_border_colors = []
            let data = data_loaded.find(v => v.id == options.file_id).data;
            for (let i = 0; i < data.header[options.x_options.key].data.length; i++) {
                const x = data.header[options.x_options.key].data[i];
                const y = data.header[options.y_options.key].data[i];
                const tags = data.header[TAG_COL]?.data[i] !== undefined ? data.header[TAG_COL].data[i].split(';') : []; // options.w_tags
                var val_x = options.x_options.formatInput(x);
                var val_y = options.y_options.formatInput(y);
                if (val_x == undefined || val_y == undefined)
                    continue;
    
                dataset_data.push({
                    x: val_x,
                    y: val_y,
                    tags: tags
                });
                bg_colors.push(options.color.convertToRGBA(0.6));
                bg_border_colors.push(options.color);
            }

            this.deletedData[dataSetIdx.toString()] = [];
            datasets.push({
                label: options.text, // has to be dataset name
                data: dataset_data,
                backgroundColor: bg_colors,
                borderColor: bg_border_colors,
                borderWidth: 1,
                showLine: options.w_line
            });

            if (options.w_corr_line) {
                // const minX = Math.min(...dataset_data.map(point => point.x));
                // const minY = Math.min(...dataset_data.map(point => point.y));
                const maxX = Math.max(...dataset_data.map(point => point.x));
                const maxY = Math.max(...dataset_data.map(point => point.y));
    
                const correlationLine = [{
                    x: 0,
                    y: 0
                }, {
                    x: maxY > maxX ? maxY : maxX,
                    y: maxY > maxX ? maxY : maxX
                }];
                
                datasets.push({
                    label: options.text + ' Corr Line',
                    data: correlationLine,
                    type: 'line',
                    borderColor: 'blue', // use variation of options.color
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    fill: false,
                    pointRadius: 0,
                    borderWidth: 2,
                    showLine: true
                });
            }


            dataSetIdx++;
        }
        return datasets;
    }

    load(data_loaded) {
        if (this.ctxMenu)
            loadContextMenu(this.id, this.ctxMenu);
        
        this.chart = new Chart(this.ctx, {
            type: 'line',
            // improve this
            plugins: this.PLUGINS,
            data: {
                datasets: this.loadDatasets(data_loaded)
            },
            options: {
                animation: {
                    duration: 0
                },
                // improve this
                plugins: {
                    zoom: {
                        zoom: this.zoom_plugin.getOptions(),
                        pan: {
                            enabled: true,
                            mode: 'xy',
                            modifierKey: 'ctrl'
                        }
                    }
                },
                events: ['contextmenu', 'mousedown', 'mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                scales: this.loadScales(this.options_list[0])
            }
        });
        
        // fill tagsList
        for (let dts of this.chart.data.datasets) {
            for (let dt of dts.data) {
                if (dt.tags && dt.tags.findIndex(t => t != '' && !this.tagsList.includes(t)) > -1)
                    this.tagsList = this.tagsList.concat(dt.tags.filter(t => !this.tagsList.includes(t)));
            }
        }

        this.updateTagBox();
    }

    // getData() {
    //     return this.chart.data.datasets[0].data;
    // }
    
    updateTagBox() {
        this.tags_ui_box.innerHTML = '';
        for(let tag of this.tagsList) {
            var span = document.createElement('span');
            var spanRemove = document.createElement('span');
            span.setAttribute('class', 'badge bg-secondary');
            // span.style.backgroundColor = tag.color;
            span.innerText = tag;
            spanRemove.innerText = 'x';
            span.addEventListener('click', () => {
                this.selectTag(tag);
            });
            spanRemove.addEventListener('click', (e) => {
                this.removeTag(tag);
                e.stopPropagation();
                e.preventDefault();
            });
            
            span.appendChild(spanRemove);
            this.tags_ui_box.appendChild(span);
        }

    }

    loadScales(base_options) {
        return { 
            x: base_options.loadScalesOptions(base_options.x_options),
            y: base_options.loadScalesOptions(base_options.y_options)
        }
    }

    deleteSelectedChartData() {
        let totalDeleted = 0; 
        if (Object.keys(this.PLUGINS[0].currentSelected).length > 0) {
            for (let i = 0; i < this.chart.data.datasets.length; i++) {
                this.chart.data.datasets[i].data = this.chart.getDatasetMeta(i).data
                    .filter(p => this.PLUGINS[0].currentSelected[i.toString()]?.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) === undefined)
                    .map(p => p.$context.raw);
    
                let deletedData = this.chart.getDatasetMeta(i).data
                    .filter(p => this.PLUGINS[0].currentSelected[i.toString()]?.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) !== undefined)
                    .map((p) => ({ cont: p.$context.raw, id: p.$context.dataIndex}));
    
                this.deletedData[i.toString()].push(deletedData);
                totalDeleted += deletedData.length;
    
                if (this.deletedData[i.toString()].length > this.deletedDataMaxLenght) {
                    this.deletedData[i.toString()].shift();
                }
            }
        }

        if (totalDeleted > 0) {
            showFeedback(FEEDBACK_E.success, `${totalDeleted.Bold()} points deleted`);
            this.PLUGINS[0].currentSelected = {};
            this.chart.update();
        }
    }    

    undo() {
        if (this.deletedData) {
            let totalRestored = 0;
            var keys = Object.keys(this.deletedData);
            for (let i of keys) {
                let lastData = this.deletedData[i].pop();
                if (lastData) {
                    for (let dt of lastData) {
                        this.chart.data.datasets[i].data.splice(dt.id, 0, dt.cont);
                    }

                    totalRestored  += lastData.length;
                }
            }

            if (totalRestored > 0) {
                showFeedback(FEEDBACK_E.success, `${totalRestored.Bold()} points restored`);
                this.chart.update();
            }
        }
    }
    
    applyFilters(datasetIdxs, filters) {
        for (let dtIdx of datasetIdxs) {
            var dataset = this.chart.getDatasetMeta(dtIdx);
            if (dataset) {
                for (let point of dataset.data) {
                    let filterResult = true;
                    if (point.$context.raw.oldX)
                        point.$context.raw.x = point.$context.raw.oldX;
    
                    if (point.$context.raw.oldY)
                        point.$context.raw.y = point.$context.raw.oldY;

                    for (let filter of filters)
                        filterResult &= filter.action(point, point.$context.raw, filter.value);
    
                    if (!filterResult) {
                        point.$context.raw.oldX = point.$context.raw.x;
                        point.$context.raw.oldY = point.$context.raw.y;
                        point.$context.raw.x = null;
                        point.$context.raw.y = null;
                    }
                }
    
            }
        }

        this.chart.options.scales.x.min = this.chart.scales['x'].min;
        this.chart.options.scales.x.max = this.chart.scales['x'].max;

        this.chart.options.scales.y.min = this.chart.scales['y'].min;
        this.chart.options.scales.y.max = this.chart.scales['y'].max;
        this.chart.update();
    }
    
    
    selectTag(tagName) {
        var last_se = [];
        for (let i = 0; i < this.chart.data.datasets.length; i++) {
            last_se.push(this.chart.getDatasetMeta(i).data
            .filter(p => p.$context.raw?.tags?.includes(tagName)));
        }
        this.PLUGINS[0].lastSelected = last_se;
        this.PLUGINS[0].updateLastSelected = true;
        this.chart.render();
    }

    setSelectedTagById(inputId) {
        var tagName = document.getElementById(inputId).value;
        if (tagName && tagName != '' )
            this.setSelectedTag(tagName);
    }

    setSelectedTag(tagName) {
        let totalTagged = 0;
        if (Object.keys(this.PLUGINS[0].currentSelected).length > 0) {
            for (let i = 0; i < this.chart.data.datasets.length; i++) {
                this.chart.data.datasets[i].data = this.chart.getDatasetMeta(i).data
                    .map(p => {
                        if (this.PLUGINS[0].currentSelected[i.toString()]?.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) !== undefined) {
                            if (p.$context.raw.tags && !p.$context.raw.tags.includes(tagName)) {
                                p.$context.raw.tags.push(tagName);
                            }
                            else if (!p.$context.raw.tags)
                                p.$context.raw.tags = [tagName];

                            totalTagged++;
                        }
                        return p.$context.raw;
                    });
            }

            showFeedback(FEEDBACK_E.success, `${totalTagged.Bold()} points set with tag ${tagName.Bold()}`);
            
            if (this.tagsList.findIndex(t => t == tagName) == -1)
                this.tagsList.push(tagName);
        
            this.updateTagBox();
            this.chart.update();
        }
    }

    removeTag(tagName) {
        for (let i = 0; i < this.chart.data.datasets.length; i++) {
            this.chart.data.datasets[i].data = this.chart.getDatasetMeta(i).data
                .map(p => {
                    if (p.$context.raw.tags?.includes(tagName))
                        p.$context.raw.tags = p.$context.raw.tags.filter(t => t != tagName);
                    return p.$context.raw;
                });
        }
        this.tagsList = this.tagsList.filter(t => t != tagName);
        this.updateTagBox();
    }

    exportCSV() {
        let headers = [];
        let file_data = [];
        for (let i = 0; i < this.chart.data.datasets.length; i++) {
            let data = this.chart.data.datasets[i].data;
            let options = this.options_list[i];

            headers.push(options.x_options.text);
            headers.push(options.y_options.text);
            headers.push(TAG_COL);
            for(let idx = 0; idx < data.length; idx++) {
                const val = data[idx];
                let x_val = val['x'];
                let y_val = val['y'];
                if (options.x_options.formatOutput !== undefined)
                    x_val = options.x_options.formatOutput(x_val);

                if (options.y_options.formatOutput !== undefined)
                    y_val = options.y_options.formatOutput(y_val);
                
                if (!file_data[idx]) {
                    file_data[idx] = []
                }

                file_data[idx].push(x_val);
                file_data[idx].push(y_val);
                file_data[idx].push(val[TAG_COL]?.join(';') ?? '');
            }
        }
        let rowsStr = file_data.map(f => f.join(',')).join('\r\n');
        download(headers.join(',') + '\r\n' + rowsStr);
    }

    static readFile(file, options, on_file_loaded) {
        var reader = new FileReader();
        let data = [];
        let bg_colors = [];
        let bg_border_colors = [];
        reader.readAsText(file, "UTF-8");

        reader.onload = (evt) => {
            const separator = ';';
            let lines = evt.target.result.split('\r\n');
            let row = 0;
            let result = { dataset_name: file.name, header: {} };
            // read line of header if w_header ON
            // read max 2 lines to get format and example value from file
            // needs to load all values after if using for file
            // later remove all values if needed when:
            // - graph is loaded
            // - a new file is loaded (here remove only the columns that won't be used)
            // ...
            let lines_to_read = options.w_header ? 2 : 1;
            let headers = []
            while (row < lines.length) {
                var line = lines[row];
                row++;
                var values = line.split(',');
                if (values.length > 0) {
                    if (options.w_header && row == 1) {
                        headers = values;
                        for (let val of values) {
                            result.header[val] = {
                                type: undefined,
                                data: []
                            }
                        }
                        continue;
                    }
                    
                    for (let index = 0; index < headers.length; index++) {
                        const header = headers[index];
                        const value = values[index];
                        if (result.header[header].type === undefined)
                        {
                            let format_date = DfDateLabelOptions.identifyFormat(value);
                            if (format_date)
                            {
                                result.header[header].formats = format_date;
                                result.header[header].type = LABEL_TYPE.date;
                            }
                            else
                                result.header[header].type = LABEL_TYPE.number; 
                        }

                        result.header[header].data.push(value); 
                    }
                }

            }
            on_file_loaded(options.id, result);
                

                
                // var points = line.split(',');
                // if (points.length > 1 && (!this.options.w_header || row > 1)) {
                //     var val_x = this.options.x_options.formatInput(points[0]);
                //     var val_y = this.options.y_options.formatInput(points[1]);
                //     if (val_x == undefined || val_y == undefined)
                //         continue;

                //     data.push({
                //         x: val_x,
                //         y:  val_y,
                //         tag: this.options.w_tags ? points[2] && points[2] != '' ? { text: points[2], color: getRandomColor() } : undefined : undefined
                //     })
                //     bg_colors.push(this.options.colors.pointBackgroundColor);
                //     bg_border_colors.push(this.options.colors.pointBorderColor);
                // }
            // }

            // LOAD ALL COLUMNS OF FILE
            
        }

        reader.onerror = function (evt) {
            console.log("error reading file");
        }

        return 
    }

    removeDataset(pos) {
        delete this.datasets[pos]
    }


    toggleOption(type) {
        this.OPTIONS[type].callback();
    }

    clearSelected() {
        this.PLUGINS[0].lastSelected = {};
        this.PLUGINS[0].updateLastSelected = true;
        this.chart.render();
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
        MM: (pos) => parseInt(strNumOnly.slice(pos, pos + 2)) - 1 < 13 ? date.setMonth(parseInt(strNumOnly.slice(pos, pos + 2)) - 1) : date.setMonth(undefined),
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
        if (date.getDate() === NaN)
            return NaN;
        var size = a.length;
        parts[a](currentPos);
        currentPos += size;
        return b;
    })


    return date;
}


String.prototype.Bold = function Bold() {
    return "<b>" + this + "</b>";
};

Number.prototype.Bold = function Bold() {
    return this.toString().Bold();
};

String.prototype.convertToRGBList = function(){
    // https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.html
    const val = this.startsWith('#') ? this.replace('#', '') : this;
    var aRgbHex = val.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

String.prototype.convertToRGB = function(){
    const listRGB = this.convertToRGBList();
    return `rgb(${listRGB.join(',')})`;
}

String.prototype.convertToRGBA = function(opacity = 1){
    const listRGB = this.convertToRGBList();
    return `rgba(${listRGB.join(',')}, ${opacity})`;
}