import playwright_stealth
print("Top level:", dir(playwright_stealth))
try:
    from playwright_stealth import stealth
    print("Submodule stealth:", dir(stealth))
except ImportError as e:
    print("Could not import stealth submodule:", e)
