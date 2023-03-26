const getValueFromPath = (path: string, obj: any) => {
    const parts = path.split('.');
    let value = obj;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (Array.isArray(value)) {
            const index = parseInt(part);

            if (isNaN(index)) {
                // throw new Error(`Invalid path: ${path}`);
                return '';
            }

            value = value[index];
        }
        else {
            value = value[part];
        }

        if (value === undefined) {
            return value;
        }
    }
    return value;
}

export default getValueFromPath;