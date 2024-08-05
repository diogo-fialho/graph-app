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
        w_tags = false) {
        this.text = text;
        this.x_options = x_options;
        this.y_options = y_options;
        this.w_header = w_header;
        this.w_tags = w_tags;
        this.colors = {
            pointBackgroundColor: 'rgba(75, 192, 192, 0.2)',
            pointSelectedBackgroundColor: 'red',
            pointBorderColor: 'rgba(75, 192, 192, 1)',
            pointSelectedBorderColor: 'red',
        };
    }

    clear() {
        this.text = '';
        this.x_options = this.X_OPTS_DEFAULT;
        this.y_options = this.Y_OPTS_DEFAULT;
        this.w_header = false;
        this.w_tags = false;
    }
    
    loadFromSave(saveData) {
        this.text = saveData.text;
        this.x_options = saveData.x_options;
        this.y_options = saveData.y_options;
        this.w_header = saveData.w_header;
        this.w_tags = saveData.w_tags;
    }

    loadFromForm(id) {
        this.text = document.getElementById(`graph-name-${id}`).value;
        this.x_options = this.loadLabelOptions(id, 'x');
        this.y_options = this.loadLabelOptions(id, 'y');
        this.w_header = document.getElementById(`lbl-w-header-${id}`).checked;
        // this.w_tags = document.getElementById(`lbl-w-tags-${id}`).checked;
    }

    returnForSave() {
        return {
            text: this.text,
            x_options: this.x_options,
            y_options: this.y_options,
            w_header: this.w_header,
            w_tags: this.w_tags,
        }
    }

    fillForm(id) {
        document.getElementById(`graph-name-${id}`).value = this.text ?? '';
        document.getElementById(`lbl-w-header-${id}`).checked = this.w_header;
        // document.getElementById(`lbl-w-tags-${id}`).checked = this.w_tags;
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
                    text: document.getElementById(`lbl-${ele_base_id}-col-${id}`).value,
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
                    text: document.getElementById(`lbl-${ele_base_id}-col-${id}`).value,
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
        this.ctx = document.getElementById(`layer-2-${options.graphId}`).getContext('2d');
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
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
        var canvas_secondary = document.getElementById(`layer-2-${this.options.graphId}`);
        var chart_canvas = chart.canvas;

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

    constructor(id, ctx, options = new DfChartOptions()) {
        this.id = id;
        this.options = options;
        this.PLUGINS = [
            new DfBoxSelectPlugin({ graphId: id, colors: options.colors })
        ]
        this.zoom_plugin = new DfZoomPlugin();
        this.ctx = ctx;
        this.tagsList = [];
        this.tags_ui_box = document.getElementById(`tags-box-${id}`);
        // this.last_datasets = undefined;
    }

    load(data) {
        // load data from columns selected, it should be the name/col
        // this.options.x_options.text
        // this.options.y_options.text
        // tag
        let dataset_data = []
        let bg_colors = []
        let bg_border_colors = []
        for (let i = 0; i < data.header[this.options.x_options.text].data.length; i++) {
            const x = data.header[this.options.x_options.text].data[i];
            const y = data.header[this.options.y_options.text].data[i];
            const tags = data.header[TAG_COL]?.data[i] !== undefined ? data.header[TAG_COL].data[i].split(';') : []; // this.options.w_tags
            var val_x = this.options.x_options.formatInput(x);
            var val_y = this.options.y_options.formatInput(y);
            if (val_x == undefined || val_y == undefined)
                continue;

            dataset_data.push({
                x: val_x,
                y: val_y,
                tags: tags
            });
            bg_colors.push(this.options.colors.pointBackgroundColor);
            bg_border_colors.push(this.options.colors.pointBorderColor);
        }
        var dataset = {
            label: this.options.text, // has to be dataset name
            data: dataset_data,
            backgroundColor: bg_colors,
            borderColor: bg_border_colors,
            borderWidth: 1,
            showLine: true
        }
        this.chart = new Chart(this.ctx, {
            type: 'line',
            // improve this
            plugins: this.PLUGINS,
            data: {
                datasets: [dataset]
            },
            options: {
                // improve this
                plugins: {
                    zoom: {
                        zoom: this.zoom_plugin.getOptions()
                    }
                },
                events: ['contextmenu', 'mousedown', 'mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                scales: this.loadScales()
            }
        });
        
        for (let dts of this.chart.data.datasets) {
            for (let dt of dts.data) {
                if (dt.tags && dt.tags.findIndex(t => t != '' && !this.tagsList.includes(t)) > -1)
                    this.tagsList = this.tagsList.concat(dt.tags.filter(t => !this.tagsList.includes(t)));
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
            .filter(p => p.$context.raw?.tags.includes(tagName));

        this.chart.render();
    }

    setSelectedTagById(inputId) {
        var tagName = document.getElementById(inputId).value;
        this.setSelectedTag(tagName);
    }

    setSelectedTag(tagName) {
        this.chart.data.datasets[0].data = this.chart.getDatasetMeta(0).data
            .map(p => {
                if (this.PLUGINS[0].currentSelected.find(p2 => p2.$context.dataIndex == p.$context.dataIndex) !== undefined) {
                    if (p.$context.raw.tags && !p.$context.raw.tags.includes(tagName)) {
                        p.$context.raw.tags.push(tagName);
                    }
                    else if (!p.$context.raw.tags)
                        p.$context.raw.tags = [tagName];
                }
                return p.$context.raw;
            });

        if (this.tagsList.findIndex(t => t == tagName) == -1)
            this.tagsList.push(tagName);
    
        this.updateTagBox();
        this.chart.update();
    }

    removeTag(tagName) {
        this.chart.data.datasets[0].data = this.chart.getDatasetMeta(0).data
            .map(p => {
                if (p.$context.raw.tags?.includes(tagName))
                    p.$context.raw.tags = p.$context.raw.tags.filter(t => t != tagName);
                return p.$context.raw;
            });
        this.tagsList = this.tagsList.filter(t => t != tagName);
        this.updateTagBox();
    }

    exportCSV() {
        let data = this.getData();
        if (data.length > 0) {
            // remove w_header, always export with header
            const headers = this.options.w_header ? [this.options.x_options.text, this.options.y_options.text, TAG_COL].join(',') + '\r\n' : '';
            let rowsStr = "";
            for(let val of data) {
                let x_val = val['x'];
                let y_val = val['y'];
                if (this.options.x_options.formatOutput !== undefined)
                    x_val = this.options.x_options.formatOutput(x_val);

                if (this.options.y_options.formatOutput !== undefined)
                    y_val = this.options.y_options.formatOutput(y_val);
                
                rowsStr += [x_val, y_val, val[TAG_COL]?.join(';') ?? ''].join(',') + '\r\n';
            }
            
            download(headers + rowsStr);
        }
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

    readFormat(value) {
        if (typeof date.getMonth === 'function')
            return 
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