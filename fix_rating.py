file_path = r"c:\Users\Lenovo\Desktop\Samuelcom\faith.samuelcom\app\admin\page.tsx"

with open(file_path, 'rb') as f:
    content = f.read()

# Replace the byte sequence for the malformed dash
# â€" is the UTF-8 encoding bytes for these characters
content = content.replace(b'\xc3\xa2\xc2\x80\xc2\x94', b'-')

with open(file_path, 'wb') as f:
    f.write(content)

print("Fixed rating labels with byte replacement")
