import re
import os
import json
import shutil

def parse_values(values_str):
    records = []
    current_record = []
    current_val = []
    in_string = False
    escape = False
    quote_char = None
    paren_depth = 0
    
    i = 0
    n = len(values_str)
    while i < n:
        c = values_str[i]
        if escape:
            if c == 'n':
                current_val.append('\n')
            elif c == 'r':
                current_val.append('\r')
            elif c == 't':
                current_val.append('\t')
            elif c == '"':
                current_val.append('"')
            elif c == "'":
                current_val.append("'")
            elif c == '\\':
                current_val.append('\\')
            else:
                current_val.append(c)
            escape = False
            i += 1
            continue
        if c == '\\':
            escape = True
            i += 1
            continue
        if in_string:
            if c == quote_char:
                if i + 1 < n and values_str[i+1] == quote_char:
                    current_val.append(quote_char)
                    i += 2
                    continue
                else:
                    in_string = False
                    quote_char = None
            else:
                current_val.append(c)
            i += 1
            continue
        
        if c in ("'", '"'):
            in_string = True
            quote_char = c
            i += 1
            continue
        elif c == '(':
            if paren_depth == 0:
                current_record = []
                current_val = []
            else:
                current_val.append(c)
            paren_depth += 1
            i += 1
            continue
        elif c == ')':
            paren_depth -= 1
            if paren_depth == 0:
                current_record.append("".join(current_val).strip())
                records.append(current_record)
            else:
                current_val.append(c)
            i += 1
            continue
        elif c == ',':
            if paren_depth == 1:
                current_record.append("".join(current_val).strip())
                current_val = []
            else:
                current_val.append(c)
            i += 1
            continue
        else:
            current_val.append(c)
            i += 1
            continue
    return records

def parse_table(filepath, table_name):
    pattern = re.compile(rf"INSERT\s+INTO\s+`{table_name}`\s*(?:\([^)]*\))?\s*VALUES\s*(.*)", re.IGNORECASE)
    records = []
    with open(filepath, "r", encoding="cp1252", errors="replace") as f:
        for line in f:
            match = pattern.search(line)
            if match:
                records.extend(parse_values(match.group(1)))
    return records

def fix_double_encoding(text):
    if not text:
        return ""
    
    replacements = [
        ('â€\ufffd', '”'), # right double quote (with replacement char)
        ('â€™', '’'),     # right single quote / apostrophe
        ('â€œ', '“'),     # left double quote
        ('â€”', '—'),     # em dash
        ('â€“', '–'),     # en dash
        ('â€¦', '…'),     # ellipsis
        ('â€¢', '•'),     # bullet
        ('â€˜', '‘'),     # left single quote
        ('â‚¬', '€'),     # euro sign
        ('â€', '”'),      # right double quote fallback
        
        # Cleanup any remaining artifacts after previous corrupt runs
        ('”˜', '‘'),
        ('”“', '–'),
        ('”', '”'),
    ]
    
    for bad, good in replacements:
        text = text.replace(bad, good)
        
    return text

def wpautop(text):
    if not text:
        return ""
    
    # Normalize line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Replace multiple empty lines with just two newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Split text into chunks by double newlines
    chunks = text.split("\n\n")
    output = []
    
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
            
        lower_chunk = chunk.lower()
        # Check if the chunk already starts with common block level tags
        if (lower_chunk.startswith("<p") or 
            lower_chunk.startswith("<div") or 
            lower_chunk.startswith("<blockquote") or 
            lower_chunk.startswith("<h1") or 
            lower_chunk.startswith("<h2") or 
            lower_chunk.startswith("<h3") or 
            lower_chunk.startswith("<h4") or 
            lower_chunk.startswith("<h5") or 
            lower_chunk.startswith("<h6") or 
            lower_chunk.startswith("<ul") or 
            lower_chunk.startswith("<ol") or 
            lower_chunk.startswith("<li") or 
            lower_chunk.startswith("<table") or 
            lower_chunk.startswith("<pre") or 
            lower_chunk.startswith("<hr") or 
            lower_chunk.startswith("<img")):
            
            # For these list or table containers, we don't insert <br />,
            # but for headings or blockquotes we can format newlines within them if any.
            if lower_chunk.startswith("<pre") or lower_chunk.startswith("<table") or lower_chunk.startswith("<ul") or lower_chunk.startswith("<ol"):
                output.append(chunk)
            else:
                output.append(chunk.replace("\n", "<br />\n"))
        else:
            # Normal paragraph chunk: replace internal single newlines with br, wrap in <p>
            formatted_chunk = chunk.replace("\n", "<br />\n")
            output.append(f"<p>{formatted_chunk}</p>")
            
    return "\n\n".join(output)

def main():
    db_path = r"C:\Users\jones\CodeZone\backup-8.31.2021_00-04-15_jowaljon\homedir\public_html\mysql\jowaljon_jowal.sql"
    
    print("Parsing database...")
    posts_raw = parse_table(db_path, "wp_posts")
    comments_raw = parse_table(db_path, "wp_comments")
    terms_raw = parse_table(db_path, "wp_terms")
    taxonomy_raw = parse_table(db_path, "wp_term_taxonomy")
    relationships_raw = parse_table(db_path, "wp_term_relationships")
    postmeta_raw = parse_table(db_path, "wp_postmeta")
    
    print(f"Extracted raw records:")
    print(f"  posts: {len(posts_raw)}")
    print(f"  comments: {len(comments_raw)}")
    print(f"  terms: {len(terms_raw)}")
    print(f"  taxonomy: {len(taxonomy_raw)}")
    print(f"  relationships: {len(relationships_raw)}")
    print(f"  postmeta: {len(postmeta_raw)}")
    
    # 1. Parse terms
    terms = {}
    for r in terms_raw:
        if len(r) >= 3:
            term_id = int(r[0])
            terms[term_id] = {
                'name': fix_double_encoding(r[1].strip("'\"")),
                'slug': r[2].strip("'\"")
            }
            
    # 2. Parse term taxonomy
    taxonomies = {}
    for r in taxonomy_raw:
        if len(r) >= 3:
            tt_id = int(r[0])
            term_id = int(r[1])
            taxonomies[tt_id] = {
                'term_id': term_id,
                'taxonomy': r[2].strip("'\"")
            }
            
    # 3. Parse term relationships
    relationships = []
    for r in relationships_raw:
        if len(r) >= 2:
            relationships.append({
                'post_id': int(r[0]),
                'tt_id': int(r[1])
            })
            
    # 4. Parse comments
    comments_by_post = {}
    for r in comments_raw:
        if len(r) >= 11:
            c_post_id = int(r[1])
            c_approved = r[10].strip("'\"")
            if c_approved == '1': # only approved comments
                c_id = int(r[0])
                c_author = fix_double_encoding(r[2].strip("'\""))
                c_date = r[6].strip("'\"")
                c_content = fix_double_encoding(r[8].strip("'\""))
                c_parent = int(r[13]) if len(r) > 13 and r[13].isdigit() else 0
                
                # Format comment content as well just in case
                comment = {
                    'id': c_id,
                    'author': c_author,
                    'date': c_date,
                    'content': wpautop(c_content),
                    'parent': c_parent
                }
                comments_by_post.setdefault(c_post_id, []).append(comment)
                
    # 5. Parse postmeta
    postmeta = {}
    for r in postmeta_raw:
        if len(r) >= 4:
            p_id = int(r[1])
            m_key = r[2].strip("'\"")
            m_val = r[3].strip("'\"")
            postmeta.setdefault(p_id, []).append({'key': m_key, 'val': m_val})
            
    # Find post featured image ID and attached files
    featured_image_ids = {}
    attached_files = {}
    for pid, metas in postmeta.items():
        for m in metas:
            if m['key'] == '_thumbnail_id':
                try:
                    featured_image_ids[pid] = int(m['val'])
                except ValueError:
                    pass
            elif m['key'] == '_wp_attached_file':
                attached_files[pid] = m['val']
                
    # 6. Parse posts
    posts = []
    attachments = {}
    
    for r in posts_raw:
        if len(r) >= 21:
            p_id = int(r[0])
            p_type = r[20].strip("'\"")
            p_status = r[7].strip("'\"")
            
            if p_type == 'attachment':
                guid = r[18].strip("'\"")
                attachments[p_id] = {
                    'guid': guid,
                    'file': attached_files.get(p_id, '')
                }
            elif p_type == 'post' and p_status == 'publish':
                p_title = fix_double_encoding(r[5].strip("'\""))
                p_content = fix_double_encoding(r[4].strip("'\""))
                p_excerpt = fix_double_encoding(r[6].strip("'\""))
                p_date = r[2].strip("'\"")
                p_modified = r[14].strip("'\"")
                p_slug = r[11].strip("'\"")
                
                # Run wpautop to convert double newlines to paragraphs!
                p_content_formatted = wpautop(p_content)
                
                # Retrieve categories and tags
                post_categories = []
                post_tags = []
                for rel in relationships:
                    if rel['post_id'] == p_id:
                        tt = taxonomies.get(rel['tt_id'])
                        if tt:
                            term = terms.get(tt['term_id'])
                            if term:
                                if tt['taxonomy'] == 'category':
                                    post_categories.append(term)
                                elif tt['taxonomy'] == 'post_tag':
                                    post_tags.append(term)
                                    
                posts.append({
                    'id': p_id,
                    'title': p_title,
                    'content': p_content_formatted,
                    'excerpt': p_excerpt,
                    'date': p_date,
                    'modified': p_modified,
                    'slug': p_slug,
                    'categories': post_categories,
                    'tags': post_tags,
                    'comments': comments_by_post.get(p_id, [])
                })
                
    # Associate featured images
    for p in posts:
        p_id = p['id']
        img_id = featured_image_ids.get(p_id)
        if img_id and img_id in attachments:
            p['featured_image'] = attachments[img_id]
        else:
            p['featured_image'] = None
            
    print(f"\nFinal count of published posts extracted: {len(posts)}")
    
    # Ensure data directory exists
    data_dir = r"C:\Users\jones\CodeZone\comrades\src\data"
    os.makedirs(data_dir, exist_ok=True)
    
    out_path = os.path.join(data_dir, "posts.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    print(f"Saved posts data to: {out_path}")
    
    # 7. Copy uploads directory
    src_uploads = r"C:\Users\jones\CodeZone\backup-8.31.2021_00-04-15_jowaljon\homedir\public_html\homedir\public_html\wp-content\uploads"
    dst_uploads = r"C:\Users\jones\CodeZone\comrades\public\wp-content\uploads"
    
    if os.path.exists(src_uploads):
        print(f"Copying uploads from {src_uploads} to {dst_uploads}...")
        os.makedirs(os.path.dirname(dst_uploads), exist_ok=True)
        shutil.copytree(src_uploads, dst_uploads, dirs_exist_ok=True)
        print("Uploads copied successfully.")
    else:
        print(f"Warning: uploads folder not found at {src_uploads}")

if __name__ == "__main__":
    main()
