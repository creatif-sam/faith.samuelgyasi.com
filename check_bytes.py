file_path = r"c:\Users\Lenovo\Desktop\Samuelcom\faith.samuelcom\app\admin\page.tsx"

with open(file_path, 'rb') as f:
    content = f.read()

# Find the position of "Rating"
pos = content.find(b'Rating (1')
if pos != -1:
    # Show 20 bytes around it
    snippet = content[pos:pos+20]
    print(f"Found at position {pos}")
    print(f"Bytes: {snippet}")
    print(f"Hex: {snippet.hex()}")
    print(f"Text: {snippet.decode('utf-8', errors='replace')}")
else:
    print("Not found")
