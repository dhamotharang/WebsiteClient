export function onAppInit1(): () => Promise<any> {
    return (): Promise<any> => {
        return new Promise((resolve, reject) => {
            console.log(`onAppInit1:: inside promise`);

            setTimeout(() => {
                console.log(`onAppInit1:: inside setTimeout`);
                // doing something
                // ...
                resolve();
            }, 3000);
        });
    };
}
