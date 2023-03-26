import { useState } from "react";


const AsyncButton = (props: any) => {
    const [pending, setPending] = useState(false);

    const handleOnClick = async () => {
        setPending(true);
        await props.onClick();
        setPending(false);
    }

    return (
        <button onClick={handleOnClick} disabled={pending}>{pending ? "pending" : props.children}</button>
    )
}

export default AsyncButton;