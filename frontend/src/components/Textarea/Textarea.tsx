import styles from "./text-area.module.css";

type Props = {
    placeholder: string;
    value: string;
    onChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement>;
    numCharsLeft: number;
};

const Textarea = ({
    placeholder,
    value,
    onChangeHandler,
    numCharsLeft,
}: Props) => {
    return (
        <>
            <textarea
                className={styles.textarea}
                placeholder={placeholder}
                value={value}
                onChange={onChangeHandler}
            />
            <span className={styles.charCount}>
                {numCharsLeft} characters left
            </span>
        </>
    );
};

export default Textarea;
