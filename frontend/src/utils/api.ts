export const parseResponse = (res: Response) => {
    if (!res.ok) {
        res.text().then((err) => {
            console.log(err)
            throw new Error(err)
        });
    } else {
        return res.json();
    }
}