{
    // Получаем текст из контекста Handlebars
    const text = options.fn(this);
    
    // Применяем форматирование
    return '<span style="color: blue; font-weight: bold;">' + text + '</span>';
}