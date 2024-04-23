export const isValidJson = (input) => {
    try {
        JSON.parse(input);
        return true;
    } catch (err) {
        return false;
    }
}