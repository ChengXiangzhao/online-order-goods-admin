import moment from 'moment';
import { getSessionStorage } from './storage';

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(
                moment(
                    `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
                ).valueOf() - 1000
            )
        ];
    }

    if (type === 'year') {
        const year = now.getFullYear();

        return [
            moment(`${year}-01-01 00:00:00`),
            moment(`${year}-12-31 23:59:59`)
        ];
    }

    if (type === 'day') {
        return moment().format('YYYY-MM-DD');
    }
    if (type === 'hour') {
        return moment().format('YYYY-MM-DD HH');
    }
    if (type === 'minute') {
        return moment().format('YYYY-MM-DD HH:mm');
    }
    if (type === 'seconds') {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }
}

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function digitUppercase(n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    let num = Math.abs(n);
    let s = '';
    fraction.forEach((item, index) => {
        s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
            /零./,
            ''
        );
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
        let p = '';
        for (let j = 0; j < unit[1].length && num > 0; j += 1) {
            p = digit[num % 10] + unit[1][j] + p;
            num = Math.floor(num / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }

    return s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
}

export function getDictText(dict, value) {
    for (let i = 0; i < dict.length; i += 1) {
        if (dict[i].value === value) {
            return dict[i].text;
        }
    }
}

export function currencyFormatter(currency, pre = '', precision = 2) {
    if (currency !== undefined && currency !== null) {
        currency = currency.toString().replace(/\$|,/g, '');
    }
    // 检查传入数值为数值类型
    if (isNaN(currency) || currency === '' || currency === null) {
        return '';
    }

    // 获取符号(正/负数)
    let sign = currency * 1 === (currency = Math.abs(currency));

    currency = Math.floor(currency * Math.pow(10, precision) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
    let cents = currency % Math.pow(10, precision); // 求出小数位数值
    currency = Math.floor(currency / Math.pow(10, precision)).toString(); // 求出整数位数值

    if (precision !== 0) {
        cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度

        // 补足小数位到指定的位数
        while (cents.length < precision) {
            cents = '0' + cents;
        }
        cents = '.' + cents;
    } else {
        cents = '';
    }

    if (currency) {
        currency = thousandthFormatter(currency);
    }
    return pre + ((sign ? '' : '-') + currency + cents);
}

export function thousandthFormatter(value) {
    let currency = value + '';
    let result = 0;
    if (currency) {
        // 对整数部分进行千分位格式化.
        for (let i = 0; i < Math.floor((currency.length - (1 + i)) / 3); i++) {
            currency =
                currency.substring(0, currency.length - (4 * i + 3)) +
                ',' +
                currency.substring(currency.length - (4 * i + 3));
        }
        result = currency;
    }
    return result;
}

/**
 * 将指定list转换为Select下拉框的选项
 * @param list
 * @param text
 * @param value
 * @returns {Array}
 */
export function switch2SelectOption(list, text, value, poflType) {
    const options = [];
    if (list instanceof Array) {
        list.forEach(item => {
            options.push({
                label: item[text],
                value: item[value],
                pofl_type: item[poflType]
            });
        });
    }
    return options;
}

export function arrayFind (arr, key, value) {
    for (let i = 0; i < arr.length; i += 1) {
        if (arr[i][key] === value) {
            return arr[i];
        }
    }
}

export function uniqueArray (arr, key) {
    let uni = [];
    arr.forEach(item => {
        if (!arrayFind(uni, key, item[key])) {
            uni.push(item);
        }
    });
    return uni;
}

export function arrayFindDeep (arr, key, value) {
    for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i];
        if (item.children) {
            const menu = arrayFindDeep(item.children, key, value);
            if (menu) {
                return menu;
            }
        } else if (arr[i][key] === value) {
            return arr[i];
        }
    }
}

// 数组取并集
export function arrUnion(arr1, arr2) {
    let arr = Array.from(new Set(arr1.concat(arr2)));
    return arr;
}
// 数组取交集
export function arrIntersection(arr1, arr2) {
    let bSet = new Set(arr2);
    let arr = Array.from(new Set(arr1.filter(item => bSet.has(item))));
    return arr;
}
// 从数组1中去除数组2中含有的元素，取差集(arr1-arr2)
export function arrDifference(arr1, arr2) {
    let aSet = new Set(arr1);
    let bSet = new Set(arr2);
    let arr = Array.from(
        new Set(
            arr1.concat(arr2).filter(item => aSet.has(item) && !bSet.has(item))
        )
    );
    return arr;
}
// 除去请求参数里面的属性值为空的键值对
export function removeNullInObject(config) {
    if (config instanceof Object && !Array.isArray(config)) {
        for (let key in config) {
            if (Array.isArray(config[key]) && config[key].length === 0) {
                delete config[key];
            } else if (!config[key] && config[key] !== 0) {
                delete config[key];
            }
        }
    }
    return config;
}

// 将对象转换成form-data形式
export function obj2FormData (obj, form, namespace) {
    let formData = form || new FormData();
    let keys = Object.keys(obj);
    for (let key of keys.values()) {
        let val = obj[key];
        // 对象嵌套
        let formKey = namespace ? `${namespace}[${key}]` : key;

        if (typeof val === 'object') {
            // 递归调用
            obj2FormData(val, formData, formKey);
        } else if (val instanceof Array) {
            //  数组内容
            if (val[0] && val[0] instanceof File) {
                // 文件上传
                for (let f of val.values()) {
                    formData.append(formKey, f);
                }
            } else {
                formData.append(formKey, val.join(','));
            }
        } else {
            // 文本内容(不含对象)
            formData.append(formKey, val);
        }
    }

    return formData;
}

export function colOperRender (opers) {
    return function (h, {record}) {
        return h('div', {}, opers.map(item => {
            return h('authorize', {
                props: {
                    code: item.code
                }
            }, [h('el-button', {
                props: {
                    type: 'text',
                    size: 'small'
                },
                on: {
                    click: () => item.onClick(record)
                }
            }, item.text)]);
        }));
    };
}

export function colRender (opers) {
    return function (h, {record}) {
        return h('div', {}, opers.map(item => {
            return h('el-button', {
                props: {
                    type: 'text',
                    size: 'small'
                },
                on: {
                    click: () => item.onClick(record)
                }
            }, item.text);
        }));
    };
}
