# Спецификация Handlebars хелперов

## 1. Хелперы агрегации

### vSum
- **Назначение**: Вычисляет сумму числовых значений в массиве
- **Параметры**:
  - context: any[] | { this: any[] } (массив или контекст с массивом)
  - field: string (имя поля для суммирования)
- **Возвращает**: number
- **Обработка данных**:
  - Автоматическое приведение значений к числу через Number()
  - Поддержка вложенных массивов через context.this
- **Примеры**:
```handlebars
{{vSum data 'sales'}} // Прямой массив
{{vSum this.monthlyData 'returns'}} // Вложенный массив
```

### vAvg
- **Назначение**: Вычисляет среднее значение
- **Параметры**: 
  - context: any[] | { this: any[] } (массив или контекст с массивом)
  - field: string (имя поля)
- **Возвращает**: number
- **Обработка данных**:
  - Возврат 0 при пустом массиве
  - Автоматическое приведение к числу
  - Поддержка вложенных массивов
- **Примеры**:
```handlebars
{{vAvg data 'sales'}} // Среднее по прямому массиву
{{vAvg this.quarterData 'quantity'}} // Среднее по вложенному массиву
```

### vCount
- **Назначение**: Подсчитывает элементы массива
- **Параметры**: 
  - context: any[] | { this: any[] } | null
- **Логирование**: 
  - Предупреждение при пустом контексте
  - Предупреждение при неверном типе данных
- **Примеры**:
```handlebars
{{vCount data}} // Количество всех записей
{{vCount this.filteredData}} // Количество отфильтрованных записей
```

### vDistinctCount
- **Назначение**: Подсчитывает уникальные значения
- **Параметры**:
  - context: any[] | { this: any[] }
  - field: string
- **Обработка данных**:
  - Фильтрация null значений
  - Обрезка пробелов
  - Приведение к строке
- **Логирование**:
  - Предупреждение при неверном типе данных
  - Предупреждение при отсутствии поля
- **Примеры**:
```handlebars
{{vDistinctCount data 'client_name'}} // Уникальные клиенты
{{vDistinctCount this.salesData 'order_date'}} // Уникальные даты
```

## 2. Хелперы форматирования

### dateFormat
- **Назначение**: Форматирование дат
- **Параметры**:
  - context: any (дата)
  - block.hash.format: string (формат даты)
- **Примеры**:
```handlebars
{{dateFormat order_date}}
{{dateFormat order_date format="DD.MM.YYYY HH:mm"}}
{{dateFormat order_date format="MMMM Do YYYY"}}
```

### vFormatNumber
- **Параметры**:
  - value: any
  - options: {
    isPercent?: boolean,
    autoPercent?: boolean,
    pattern?: string,
    signPosition?: 'left' | 'right' | 'brackets' | 'none',
    minFraction?: number,
    maxFraction?: number
  }
- **Обработка ошибок**:
  - Возврат '-' при null/undefined
  - Возврат '-' при неверном числе
  - Логирование ошибок форматирования
- **Примеры**:
```handlebars
{{vFormatNumber sales pattern="# ##0.00"}}
{{vFormatNumber returns pattern="# ##0" signPosition="brackets"}}
{{vFormatNumber (vDiv returns sales) isPercent=true autoPercent=true}}
{{vFormatNumber quantity minFraction=2 maxFraction=4}}
{{vFormatNumber price pattern="# ##0.00" signPosition="right"}}
```

### stringify
- **Назначение**: JSON сериализация
- **Параметры**:
  - obj: any
  - obj2: any (проверка наличия объекта)
- **Ошибки**: Требует указания объекта
- **Примеры**:
```handlebars
{{stringify data}}
{{stringify (lookup data 0)}}
```

## 3. Хелперы группировки

### vGroupBy
- **Параметры**:
  - data: any[]
  - options: {
    field: string,
    type: FieldType ('date' | 'number' | 'string'),
    format?: string
  }
- **Форматирование**:
  - Даты: moment.js форматирование
  - Числа: дополнение нулями для сортировки
  - Строки: прямое преобразование
- **Примеры**:
```handlebars
{{#vGroupBy data field="order_date" type="date" format="YYYY-MM"}}
  {{displayValue}}: {{vSum this 'sales'}}
{{/vGroupBy}}

{{#vGroupBy data field="quantity" type="number"}}
  Количество {{@key}}: {{vCount this}}
{{/vGroupBy}}

{{#vGroupBy data field="client_name" type="string"}}
  {{displayValue}}
  Продажи: {{vFormatNumber (vSum this 'sales')}}
  Возвраты: {{vFormatNumber (vSum this 'returns')}}
{{/vGroupBy}}
```

## 4. Математические хелперы

### vDiv
- **Параметры**: 
  - obj: number (делимое)
  - obj1: number (делитель)
- **Обработка**: Возврат 0 при делении на 0
- **Примеры**:
```handlebars
{{vDiv returns sales}}
{{vFormatNumber (vDiv returns sales) isPercent=true}}
{{vDiv (vSum data 'returns') (vSum data 'sales')}}
```

## 5. Строковые хелперы

### vContains
- **Параметры**:
  - obj: string (где искать)
  - obj1: string (что искать)
  - fromIndex?: number (начальная позиция)
- **Примеры**:
```handlebars
{{vContains client_name "John"}}
{{vContains client_name "John" 5}}
{{#if (vContains client_name "VIP")}}
  Важный клиент
{{/if}}
```

## Комплексный пример
```handlebars
{{#vGroupBy data field="order_date" type="date" format="YYYY-MM"}}
  <h2>{{dateFormat @key format="MMMM YYYY"}}</h2>
  
  <div>Статистика за период:</div>
  Количество заказов: {{vCount this}}
  Уникальных клиентов: {{vDistinctCount this 'client_name'}}
  
  <div>Финансы:</div>
  Продажи: {{vFormatNumber (vSum this 'sales') pattern="# ##0.00"}}
  Возвраты: {{vFormatNumber (vSum this 'returns') pattern="# ##0.00"}}
  Процент возвратов: {{vFormatNumber (vDiv (vSum this 'returns') (vSum this 'sales')) isPercent=true minFraction=2}}
  
  <div>Средние показатели:</div>
  Средний чек: {{vFormatNumber (vAvg this 'sales') pattern="# ##0.00"}}
  Среднее количество: {{vFormatNumber (vAvg this 'quantity') minFraction=0}}
{{/vGroupBy}}
```